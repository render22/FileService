var express = require('express');
var path = require('path');
var config = require('./config/application.json');
var apiRoutes = require('./routes/api.js');
var session = require('express-session');
var engine = express();


var projectRoot = path.normalize(__dirname + '/../');
var applicationPath = __dirname;

engine.set('config', config);

engine.set('port', process.env.PORT || (config.server && config.server.port) || 3000);


/**
 * Initializing application core
 * @constructor
 */
function Start() {

    initDb(engine);

    initMiddlewares(engine);

    initView(engine);

    apiRoutes(engine);

    initErrorRoutes(engine);


    engine.listen(engine.get('port'), function () {
        console.log('Server started ' + engine.get('port'));
    });


}


try {
    Start();
} catch (e) {
    console.log(e.message);
    console.log(e.stack);
}


/**
 * Initializing postgres database, getting and passing to global app property bookshelf ORM instance
 * @param app
 */
function initDb(app) {
    var dbConf = app.get('config').credentials.db.pg;

    if (process.env.NODE_APP_LOCATION === 'local')
        connectionLink = dbConf.local.connectionLink

    var pg = require('knex')({
        client: 'pg',
        connection: (process.env.NODE_ENV === 'unit-tests') ?
            dbConf['unit-tests'].connectionLink
            :
            dbConf[process.env.NODE_APP_LOCATION].connectionLink
        //  debug:true
    });

    app.set('pg', pg);
    var bookshelf = require('bookshelf')(pg);

    app.set('bookshelf', bookshelf);


}

/**
 * Initializing common middlewares
 * @param app
 */
function initMiddlewares(app) {

    var pg = require('pg');
    app.use(express.static(projectRoot + '/public'));
    app.use(require('cookie-parser')(config.credentials.cookieSecret));
    var pgSession = require('connect-pg-simple')(session);
    var dbConf = app.get('config').credentials.db.pg;

    app.use(session({
        store: new pgSession({
                pg: pg,
                conString: (process.env.NODE_ENV === 'unit-tests') ?
                    dbConf['unit-tests'].connectionLink
                    :
                    dbConf[process.env.NODE_APP_LOCATION].connectionLink
            }
        ),
        secret: config.credentials.cookieSecret,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000
        } // 30 days
    }));


    app.use(function (request, response, next) {

        if (request.session.user) {
            response.locals.isAuth = true;
            response.locals.isAdmin = request.session.user.role === 'admin' ? true : false;
            response.locals.firstname = request.session.user.firstname;
            response.locals.uid = request.session.user.id;

        }
        next();


    });


}

/**
 * Initializing handlebars view engine
 * @param app
 */
function initView(app) {
    app.set('views', app.get('appPath') + '/views');
    app.set('layouts', app.get('appPath') + '/views');
    var handlebars = require('express3-handlebars')
        .create(
        {
            extname: 'hbs',
            partialsDir: app.get('appPath') + '/views/partials',
            layoutsDir: app.get('appPath') + '/views/layouts',
            defaultLayout: 'main',
            helpers: require(applicationPath + '/helpers/handlebars.js')

        }
    );

    app.engine('hbs', handlebars.engine);

    app.set('view engine', 'hbs');


}

/**
 * Initializing routes for error handling
 * @param engine
 */
function initErrorRoutes(engine) {
    engine.use(function (req, res, next) {

        res.status(404);

        return res.send('404');

    });

    // 500 error handler (middleware)

    engine.use(function (err, req, res, next) {

        console.error(err.stack);

        res.status(500);

        return res.send('500');

    });
}
