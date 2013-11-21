var cluster = require('cluster')
  , backgroundTasks = null
  , cp = require('child_process')
  , config = require('./config');

// Set the node path - this works only because the other processes are forked.
// process.env.NODE_PATH = process.env.NODE_PATH ? './src/:' + process.env.NODE_PATH : './src/';

if ( cluster.isMaster ) {
    cluster.on('exit', function( worker, code, signal ) {
        console.dir( arguments );
        cluster.fork();
    });
    for ( var i=0; i<config.numChildren; ++i ) {
        cluster.fork();
    }

    Object.keys( cluster.workers ).forEach(function( id ) {
        cluster.workers[ id ].on('message', function( msg ) {
            console.log('Master ' + process.pid + ' received message from worker ' + id + '.', msg);
            
            //Send message to background task
            if( msg.cmd == 'backgroundTask'){
                backgroundTasks.send({ cmd: 'master', task:msg.task, wrkid: id });
            }
        });
    });

    // Setup the background tasks worker
    if ( config.background && config.background.enabled === true ) {
        function setupBackgroundTasks() {
            console.log('Setup background tasks...');

            backgroundTasks = cp.fork('./bin/backgroundTasks.js');
            backgroundTasks.on('exit', setupBackgroundTasks);
            backgroundTasks.on('message', function( msg ){
                console.log('\nMaster ' + process.pid + ' received message from Background Task Process ' + this.pid + '.', msg);
                msg['cmd'] = 'master';
                
                ( !msg.wrkid ) ? backgroundTasks.send( msg ) : cluster.workers[ msg.wrkid ].send( msg ) ;
            });
        }
        setupBackgroundTasks();
    }

} else {
    require('./index.js');
}
