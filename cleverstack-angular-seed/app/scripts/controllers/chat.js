define(['app'], function(app) {
    'use strict';

    app.controller('ChatCtrl', ['$scope', '$auth', '$injector',
        function($scope, $auth, $injector) {

            console.log('Chat controller...');


            // inject the user service if it doesn't exist
            // if (!$scope.userService) {
            //     $scope.userService = $injector.get('UserService');
            // }

            // // get all users
            // $scope.users = $scope.userService.getUsers();

            // update current user when it changes
            $scope.$watch($auth.getCurrentUser, function() {
                $scope.user = $auth.getCurrentUser() || false;
            });

            $scope.users = [];
            $scope.messages = [];

            var socket = io.connect('http://162.243.69.108:8080');
            socket.on('connect', function(data) {
                // socket connected
                console.log('socket connected');
                $scope.connect(data);
            });
            socket.on('disconnect', function(data) {
                // socket disconnected
                console.log('socket disconnected');
                $scope.disconnect(data);
            });
            $scope.$on('$destroy', function(event) {
                console.log('scope destoyed...');
                socket.removeListener(this);
                $scope.disconnect();
            });


            $scope.connect = function(data) {

                socket.emit('connect', $scope.user);

            };

            $scope.disconnect = function(data) {

                socket.emit('disconnect', $scope.user);

            };

            // Incoming active user list
            socket.on('userlist', function(data) {

                console.log('updated userlist');
                $scope.users = data;
                $scope.$apply();

            });

            // Incoming message
            socket.on('chatmessage', function(data) {

                console.log('message recieved: ' + data.text);
                $scope.messages.push({
                    id: data.id,
                    text: data.text,
                    uid: data.uid,
                    user: data.user
                });
                if(!$scope.$$phase) {
                    $scope.$apply();
                }

            });

            // Outgoing message
            $scope.sendMsg = function(msg) {

                console.log('sending message: '+msg.text);
                socket.emit('chatmessage', msg);
                $scope.messages.push(msg);
                if(!$scope.$$phase) {
                    $scope.$apply();
                }

            };

            // New message by user
            $scope.newMsg = function() {

                var msg = {
                    id: new Date().getTime(),
                    text: $scope.message,
                    uid: $scope.user.id,
                    user: $scope.user.username
                };
                $scope.sendMsg(msg);
                $scope.message = '';

            };



        }
    ]);

});
