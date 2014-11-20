var apiController = require('../controllers/api.js');
//var oAuth = require('../library/oAuth.js');

/**
 * Api application routes initialization with authentication
 * @param app
 */
module.exports = function (app) {
    /*
     Initialize api controller on router startup
     */
    apiController.init(app);
   // oAuth.init(app);

    app.use('/api/*', require('body-parser').json());


   /* app.post('/api/getclienttoken', oAuth.getClientToken());
    app.post('/api/getusertoken', oAuth.getUserToken());


    app.use(new RegExp('/api/(' + app.get('config').api.private.join('|') + ')/?(.*)'), oAuth.authenticateBearer('user'));
    app.use(new RegExp('/api/(' + app.get('config').api.privateAdmin.join('|') + ')/?(.*)'), oAuth.authenticateBearer('user', 'admin'));
    app.use('/api*//*', function (req, res, next) {
        if (!req.user) {
            oAuth.authenticateBearer('client').apply(this, arguments);
        } else {
            next();
        }

    });*/




    /*Public*/
    app.post('/api', function (req, res) {
        apiController.index.apply(apiController, arguments);
    });



    /*Error handling*/
    app.use('/api/*', function (err, req, res, next) {

        console.error(err.stack);

        res.status(500);

        return res.json(err);

    });
}
