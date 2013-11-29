var crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(UserService) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        UserService.findById(id)
            .then(done.bind(null, null))
            .fail(done);
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        var credentials = {
            username: username,
            password: crypto.createHash('sha1').update(password).digest('hex'),
            confirmed: true,
            active: true
        };

        UserService.authenticate(credentials)
            .then(done.bind(null, null))
            .fail(done);
    }));

    return (require('classes').Controller).extend({
        service: UserService,

        requiresLogin: function(req, res, next) {
            if (!req.isAuthenticated())
                return res.send(401, 'requiresLogin');
            next();
        },

        requiresAdminRights: function(req, res, next) {
            if (!req.isAuthenticated() || !req.session.passport.user || !req.session.passport.user.hasAdminRight)
                return res.send(403, 'requiresAdminRights');
            next();
        },

        checkPasswordRecoveryData: function(req, res, next) {
            var userId = req.body.userId || req.body.user,
                password = req.body.password,
                token = req.body.token;
            expTime = req.body.exp;


            if (!token || !userId) {
                return res.json(400, 'Invalid Token.');
            }

            if (!password) {
                return res.json(400, 'Password does not much the requirements');
            }

            //Check timestamp
            var now = moment.utc().valueOf();
            if (now > expTime) {
                return res.json(400, 'Token has been expired');
            }

            next();
        },

        isEmailAvailable: function(req, res, next) {

            var uEmail = req.body.email,
                available = false;

            if (!uEmail) {
                res.send(401, {});
                return;
            }

            console.log("Checking new registrant " + uEmail + "...");
            UserService.emailExists(uEmail)
                .then(function(user) {
                    if (!user) {
                        console.log('Email is available...');
                        available = true;
                    }
                    res.send(200, {
                        status: available
                    });
                })
                .fail(function() {
                    res.send(401, {});
                });

        }

    }, {
        postAction: function() {
            var self = this;
            var data = self.req.body;
            if (data.id) {
                return self.putAction();
            }

            if (data.password) {
                data.password = crypto.createHash('sha1').update(data.password).digest('hex');
            }

            UserService
                .create(data)
                .then(this.proxy('send'))
                .fail(self.proxy('handleException'));
        },

        putAction: function() {
            var user = this.req.user;
            var data = this.req.body;
            if (data.password) {
                data.password = crypto.createHash('sha1').update(data.password).digest('hex');
            }

            if (data.new_password) {
                UserService.find({
                    where: {
                        id: data.id,
                        password: data.password
                    }
                })
                    .then(this.proxy('handleUpdatePassword', data.new_password))
                    .fail(this.proxy('handleException'));
            } else {
                UserService
                    .update(user, data)
                    .then(this.proxy('send'))
                    .fail(this.proxy('handleException'));
            }
        },

        listAction: function() {
            UserService
                .getAllUsers()
                .then(this.proxy('send'))
                .fail(this.proxy('handleException'));
        },

        handleUpdatePassword: function(newPassword, user) {
            if (user.length) {
                user = user[0];
                user.updateAttributes({
                    password: crypto.createHash('sha1').update(newPassword).digest('hex')
                }).success(function(user) {
                    this.send({
                        status: 200,
                        results: user
                    });
                }.bind(this)).fail(this.proxy('handleException'));
            } else {
                this.send({
                    status: 500,
                    error: "Incorrect old password!"
                });
            }
        },

        loginAction: function() {
            passport.authenticate('local', this.proxy('handleLocalUser'))(this.req, this.res, this.next);
        },

        handleLocalUser: function(err, user) {
            if (err) return this.handleException(err);
            if (!user) return this.send(403);
            this.loginUserJson(user);
        },

        loginUserJson: function(user) {
            this.req.login(user, this.proxy('handleLoginJson', user));
        },

        handleLoginJson: function(user, err) {
            if (err) return this.handleException(err);
            this.send(UserService.toJSON(user));
        },

        currentAction: function() {
            var user = this.req.user;
            if (!user) {
                return this.send({});
            }
            this.send(UserService.toJSON(user));
        },

        authorizedUser: function(user) {
            console.dir(user);
            if (user) {
                this.req.login(user);
                this.res.send(200);
            } else {
                this.res.send(403);
            }
        },

        logoutAction: function() {
            this.req.logout();
            this.res.send(200);
        },

        recoverAction: function() {
            var email = this.req.body.email;

            if (!email) {
                this.send('missing email', 400);
                return;
            }

            UserService
                .find({
                    where: {
                        email: email
                    }
                })
                .then(this.proxy('handlePasswordRecovery'))
                .fail(this.proxy('handleException'));
        },

        handlePasswordRecovery: function(user) {

            if (!user.length) {
                this.send({}, 403);
                return;
            }

            UserService
                .generatePasswordResetHash(user[0])
                .then(this.proxy('handleMailRecoveryToken'))
                .fail(this.proxy('handleException'));

        },

        handleMailRecoveryToken: function(recoverData) {

            if (!recoverData.hash && recoverData.statuscode) {
                this.handleServiceMessage(recoverData);
                return;
            }

            UserService
                .mailPasswordRecoveryToken(recoverData)
                .then(this.proxy("handleServiceMessage"))
                .fail(this.proxy("handleException"));
        },

        resetAction: function() {
            var userId = this.req.body.userId || this.req.body.user,
                password = this.req.body.password,
                token = this.req.body.token;

            UserService
                .findById(userId)
                .then(this.proxy('handlePasswordReset', password, token))
                .fail(this.proxy('handleException'));

        },

        handlePasswordReset: function(password, token, user) {

            if (!user) {
                this.send({}, 403);
                return;
            }

            UserService
                .generatePasswordResetHash(user)
                .then(this.proxy('verifyResetTokenValidity', user, password, token))
                .fail(this.proxy('handleException'));

        },

        verifyResetTokenValidity: function(user, newPassword, token, resetData) {

            if (!resetData.hash && resetData.statuscode) {
                this.handleServiceMessage(resetData);
                return;
            }

            var hash = resetData.hash;
            if (token != hash) {
                return this.send('Invalid token', 400);
            };

            this.handleUpdatePassword(newPassword, [user]);

        },

        confirmAction: function() {
            var password = this.req.body.password,
                token = this.req.body.token,
                userId = this.req.body.userId;


            UserService.findById(userId)
                .then(this.proxy('handleAccountConfirmation', password, token))
                .fail(this.proxy('handleException'));

        },

        handleAccountConfirmation: function(pass, token, user) {
            if (!user) {
                this.send('Invalid confirmation link', 403);
                return;
            }
            if (user.confirmed) {
                this.send('You have already activated your account', 400);
                return;
            }

            UserService.generatePasswordResetHash(user)
                .then(this.proxy("confirmAccount", user, pass, token))
                .fail(this.proxy("handleException"));

        },

        confirmAccount: function(user, pass, token, hashobj) {

            if (!hashobj.hash && hashobj.statuscode) {
                this.handleServiceMessage(hashobj);
                return;
            }

            if (token !== hashobj.hash) {
                this.send('Invalid token', 400);
                return;
            }

            var newpass = crypto.createHash('sha1').update(pass).digest('hex');

            user
                .updateAttributes({
                    active: true,
                    confirmed: true,
                    password: newpass
                })
                .success(this.proxy('send', 200))
                .error(this.proxy('handleException'));

        },

        resendAction: function() {
            var me = this.req.user,
                userId = this.req.params.id;


            UserService
                .resendAccountConfirmation(me.account.id, userId)
                .then(this.proxy('handleServiceMessage'))
                .then(this.proxy('handleException'));

        },

        handleServiceMessage: function(obj) {

            if (obj.statuscode) {
                this.send(obj.message, obj.statuscode);
                return;
            }

            this.send(obj, 200);
        }
    });
};
