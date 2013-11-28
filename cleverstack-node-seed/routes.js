var passport = require('passport');

module.exports = function(app) {
    var injector = app.get('injector');

    injector.inject(function(ExampleController, UserController) {

        app.all('/example/:action/:id?', ExampleController.attach());
        app.all('/example/?:action?', ExampleController.attach());

        app.all('/user/isEmailAvailable', UserController.isEmailAvailable, UserController.attach());

        app.get('/user/current', UserController.attach());
        app.post('/user/login', UserController.attach());
        app.post('/user', UserController.attach());

        app.all('/user/:action/:id?', UserController.requiresLogin, UserController.attach());
        app.all('/user/?:action?', UserController.requiresLogin, UserController.attach());
    });
};
