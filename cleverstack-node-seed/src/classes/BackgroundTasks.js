var Class = require('uberclass')
  , async = require('async')
  , MemCached = require('memcached')
  , moment = require('moment');

module.exports = Class.extend(
    {

    },
    {
        isMaster: null,

        isMasterScanning: null,

        masterKey: null,

        serverKey: null,

        memcache: null,

        interval: null,

        tasksToRun: null,

        init: function() {
            this.isMaster = false;
            this.isMasterScanning = false;
            this.masterKey = process.env.NODE_ENV + '_backgroundTasks';
            this.serverKey = Date.now() + Math.floor(Math.random()*1001); // @TODO - implement storing the server key in /tmp/serverKey
            this.memcache = new MemCached( config.memcacheHost )
            this.setupTasksAndStartMasterLoop();
            //Process Messages coming from the cluster
            process.on('message', this.proxy('handleMessage'));
        },

        handleMessage: function( msg ){
            var taskObj;
            var m = { 
                type   : 'error'
            ,   result : 'invalid'
            ,   wrkid  : ( !msg.wrkid ) ? null : msg.wrkid
            ,   pid    : process.pid
            };
            
            if( this.tasksToRun !== null ){
                if( config.background.on ){
                    var l = config.background.tasks.length, item;

                    while ( l-- ) {
                        item = config.background.tasks[ l ];
                        if( ( item.name == msg.task ) && ( tasks[ item.name ] !== undefined ) ){
                             taskObj = tasks[ item.name ];
                        };
                    };
                }

            }

            if( taskObj ){
                taskObj.startTask(function( err, result ){
                    
                    if( !err ){
                        m['type'] = 'success';
                        m['result'] = result;
                    }else{
                        m['type'] = 'error';
                        m['result'] = err;
                    }
                    
                    process.send(m);
                });
            }else{
                process.send(m);
            }
        },

        mainLoop: function() {
            if ( this.isMasterScanning === false ) {
                this.isMasterScanning = true;

                if ( this.isMaster !== true ) {
                    this.getMasterLock();
                } else {
                    
                    async.parallel([
                        this.runMasterTasks
                    ,   this.runTasks
                    ],
                        this.proxy( 'tasksAreCompleted' )
                    );

                }

            } else {
                this.holdMasterLock();
                console.log('already scanning');
            }
        },

        getMasterLock: function() {
            this.memcache.gets( this.masterKey, this.proxy('handleGetMasterLock') );
        },

        handleGetMasterLock: function( err, result ) {
            if ( err ) {
                console.error( 'Unable to gets the lock from memcache. Err:' + err + ' Result:' + result );
                this.tasksAreRunning = false;
            } else if ( result === false ) {
                this.memcache.add( this.masterKey, this.serverKey, 30, function( addErr, addResult ) {
                    if ( addResult && !addErr ) {
                        console.log( 'Got master lock.' );
                        this.isMaster = true;
                        this.runMasterTasks();
                    } else {
                        console.error( 'Unable to add the lock key into memcache. Err:' + addErr + ' Result:' + addResult );
                        this.tasksAreRunning = false;
                    }
                }.bind(this));
            } else {
                if ( result && result[this.masterKey] === this.serverKey ) {
                    console.log( 'Discovered that im the master.' );
                    this.isMaster = true;
                    this.runMasterTasks();
                } else {
                    console.log( 'There is already a master holding the lock!' );
                    this.tasksAreRunning = false;
                }
            }
        },

        holdMasterLock: function() {
            if ( this.isMaster ) {
                this.memcache.gets( this.masterKey, function( err, result ) {
                    if ( !err && result && result.cas ) {
                        this.memcache.cas( this.masterKey, this.serverKey, result.cas, 30, function( casErr, casResult ) {
                            if ( casErr ) {
                                console.log( 'Cannot hold onto master lock.' );
                            } else {
                                console.log( 'Held onto master lock.');
                            }
                        }.bind( this ));
                    }
                }.bind( this ));
            }
        },

        // should go to memcache to try and keep a key using CAS (should check the value matches the randomly generated master id of this process)
        runMasterTasks: function() {
            this.holdMasterLock();

            console.log( 'Run master tasks.' );
            async.parallel(
                this.tasksToRun.master,
                this.proxy( 'tasksAreCompleted' )
            );
        },

        runTasks : function( ){
            console.log( 'Run non master tasks.' );
            async.series(
                this.tasksToRun.nomaster,
                this.proxy( 'tasksAreCompleted' )
            ); 
        },

        tasksAreCompleted : function(){
            console.log( 'tasksAreCompleted', err );
            if ( err ) {
                console.dir(err.stack);
            }

            this.tasksAreRunning = false;
        },

        setupTasksAndStartMasterLoop : function( ){
            async.series([
                this.proxy( 'setupBackgroundTask' )
            ,   this.proxy( 'initMasterLoop' )
            ]);

        },

        setupBackgroundTask : function( cback ){
            console.log( "Check which tasks needs to run" );
            var t = null
            ,   cbt = config.background;

            if( cbt.on ){
                var l = cbt.tasks.length, item;
                t = {
                    master:[]
                ,   nomaster:[]
                };

                while ( l-- ) {
                    item = cbt.tasks[ l ];
                    
                    var key = ( item.masterOnly ) ? 'master':'nomaster';
                    if( tasks[ item.name ] !== undefined ){

                         //Use one common "functionName" for every task so we can do 
                         // async.parallel( this.tasksToRun.master, callback);
                         t[ key ].push( tasks[ item.name ].startTask ); 
                    };
                };
            }

            this.tasksToRun = t;
            cback(null);
        },
        initMasterLoop: function(  cback ){
            console.log( "Initiate Master Loop" );
            this.interval = setInterval( this.proxy( 'mainLoop' ), 15000 );
            this.mainLoop();
            cback(null);
        }
    });