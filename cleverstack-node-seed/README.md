# CleverStack Node Seed
##### A proper Node seed featuring:
1. A Highly Configurable Environment
2. Automated tasks with `grunt`
3. Lightning Fast Unit and Integration Testing Support with `mocha`
4. MEAN Stack (Mongo, Express, Angular, Node) - use our angular-seed with this repo.
5. ORM & ODM (SQL & NoSQL) run side by side for ultimate flexibility and control.

## 1. Features ##

#### Documentation with [Docular](https://github.com/gitsome/docular):
Your docs can be watched, built upon source code changes and served off `localhost:8888` with just `grunt server:docs`.

To manually build the documentation run `grunt docs`.

#### Run the server with [Grunt](http://gruntjs.com/):
To start the local servers do: `grunt server`

This will run your server from the port configured in your `environment` file inside the `config` folder. It uses `nodemon` to keep it alive and restart it upon code changes.

#### Test Running with [Mocha](http://visionmedia.github.io/mocha/):
Running tests takes a breeze with `mocha`, and we provide handy shortcuts for it:

1. `grunt test` or `grunt test:unit` to run unit tests.
2. `grunt test:e2e` to run integration tests.
3. `grunt test:ci` to watch and rerun your tests on file changes.

Any of this tasks can be easily configured to use any `mocha` reporters, in case you need an specific output.

#### Database Tasks:
Note: Currently these db tools only work with ORM, please refer to Mongoose documentation for ODM usage - We are working on cleaning this up.
We also provide database tasks to `rebase` and `seed` very quickly.

1. `grunt db` will first `rebase` and then `seed`.
2. `grunt db:rebase` will `rebase` the database.
3. `grunt db:seed` will `seed` with the data inside the `schema/seedData.json` file.

## 2. Setup ##
Just run `npm run-script setup`.

#### 2.1. Prerequisites ####
Only `grunt-cli` is required.

#### 2.2 Known Issues ####
None so far :)

## 3. Usage ##
A shortcut `npm start` is provided to run `grunt server`.

* a development server on `localhost:9000`
* a functional testing server on `localhost:9090/test/e2e/runner.html`
* a production server on `localhost:9009`

What a normal start looks like:
```
$ npm start
npm WARN package.json cleverstack-node-seed@0.0.2 No repository field.

> cleverstack-node-seed@0.0.2 start ./cleverstack-node-seed
> grunt

Running "concurrent:servers" (concurrent) task
Running "nodemon:web" (nodemon) task
Running "watch:docs" (watch) task
Waiting...Running "connect:docs" (connect) task
Started connect web server on localhost:8888.

Running "watch:docs" (watch) task
Waiting...20 Aug 13:18:21 - [nodemon] v0.7.10
20 Aug 13:18:21 - [nodemon] to restart at any time, enter `rs`
20 Aug 13:18:21 - [nodemon] watching: ./cleverstack-node-seed/src
20 Aug 13:18:21 - [nodemon] starting `node app.js`
20 Aug 13:18:21 - [nodemon] reading ignore list
Starting server on port 8080 in LOCAL mode
```

### 3.1 Environment-specific configuration mechanisms

Configuration Files:

* `config/global.json` is where you put all your defaults/global stuff (for production)
* `config/NODE_ENV.json` is also loaded and recursively merged with global (where `NODE_ENV` is one of 'local', 'dev', 'stag' or 'prod')

You should set your `NODE_ENV` environment variable (but on your local machine you shouldn't need to, it will default to use `config/local.json`).

Also, note `local.json` is ignored in `.gitignore`, but you have a sample in `local.example.json`.

```
1. Postgres & MySQL, MongoDB
2. Hybrid models that can run SQL and NoSQL side by side
3. Transaction example
```

### 3.2 Config Options
```
{
    "webPort": 8080, // The port that the application will run on

    "numChildren": 1, // The number of children to spawn in the cluster, use N-1 where N is the number of cores in your CPU.
    
    "params": {
        "appName": "" // Name of the application
    },

    "secretKey": "changeme", // Secret key for sessions

    "memcacheHost": "some.host.com:11211", // The memcache server for Background-Tasks
    
    // Redis Configuration
    "redis": {
        "host": "10.0.0.1",
        "port": "6379",
        "prefix": "dev",
        "key": ""
    },

    "db": {
        "username": "",
        "password": "",
        "database": "",
        "options": {
            "host": "",
            "dialect": "mysql", // or postgre - Note: if you use PG then you must put "omitNull": true in options.
            "port": 3306
        }
    },

    "mongoose": {
        "uri": "mongodb://localhost/database" // Uri of your mongo server for use with ODM (Mongoose)
    }
}
```


### 3.3 Dependency injection

#### Write modules
```
// src/controllers/ExampleController.js
module.exports = function () {
   return {};
};
```

#### Setup injector
```
var Injector = require( './src/utils/injector' );
   
var injector = Injector(  __dirname + '/src/services', __dirname + '/src/controllers' );
   injector.instance( 'config', config );
   injector.instance( 'models', models );
   injector.instance( 'db', db );
```

#### Use injector
```js
injector.inject( function (ExampleController, models, config) {
   // this function will be called asynchronously after all required modules are initialized
});
```

For more details take a look at provided [testsuite](test/server/unit/test.utils.injector.js).
There are all possible use cases.

### 3.4 Service Layer
Needs to be documented.

### 3.5 Security

* `config/security.json` is where all your security settings are set.

Set attributes on the security object in security.json to enable and configure security middlewares.
The following keys can be set on the security object:

 - csp: Content Security Policy
 - hsts: HTTP Strict Transport Security
 - xframe: X-FRAME-OPTIONS
 - iexss: X-XSS-PROTECTION
 - contentTypeOptions: X-Content-Type-Options
 - cacheControl: Cache-Control

We are using [Helmet](https://github.com/evilpacket/helmet). Check it out to learn more.

## 4. Deployment ##
Needs to be documented.

## 5. Contributing ##
We welcome all help, but please follow these guidelines (Work In Progress):

#### 5.1 Git commit message style ###
We follow these [Git Commit Message Conventions](https://docs.google.com/document/d/12niRA9r8j8C4W0_0y_fRrKDjKIq2DBknbkrWQQl1taI/). Thou it's not entirely mandatory, we generate Changelogs with this so please keep in mind.

#### 5.2 Some words about coding style ###
- Semi-colons.
- Curly braces for single line if blocks. Same for loops and other places.
- Spacing. Indentation = 4 spaces.
- Spacing in functions. `function( like, this ) {}`
- Variable declarations. If multiple variables are defined, use a leading comma for separation.
- Camelcased variable names. No underscores.
- Make sure that key is in objects when iterating over it. See below.

#### 5.3 Spaces ####

Use spaces when defining functions.

```js
function( arg1, arg2, arg3 ) {
    return 1;
}
```

Use spaces for if statements.

```js
if ( condition ) {
    // do something
} else {
    // something else
}
```

#### 5.4 Variable declarations ####

```js
var num  = 1
  , user = new User()
  , date = new Date();
```

#### 5.5 For-In-loops ####

```js
for ( var key in obj ) {
    if ( obj.hasOwnProperty( key ) ) {
        console.log( obj[ key ] );
    }
}
```

#### 5.6 JSHint options ####

```js
fill me in
```
