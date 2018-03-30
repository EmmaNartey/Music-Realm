var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var _ = require('lodash');
var validator = require('validator');
var cors = require('cors');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(expressValidator({
    customValidators: {
        isIntList: function(value) {
            if (!_.isString(value)) {
                return false;
            }
            return _.every(value.split(','), function(v) {
                return validator.isInt(v);
            });
        }
    }
}));
app.use(cookieParser());
app.use(cors());

var apiRouter = express.Router();

apiRouter.use('/account/register/', require('./routes/app_routes/register'));
apiRouter.use('/songs/', require('./routes/app_routes/songs'));
apiRouter.use('/songs/search', require('./routes/app_routes/songs'));
apiRouter.use('/comments/', require('./routes/app_routes/comments'));
apiRouter.use('/editions/', require('./routes/dashboard_routes/editions'));
apiRouter.use('/countries/', require('./routes/dashboard_routes/editions'));
apiRouter.use('/rss/', require('./routes/dashboard_routes/rss'));
apiRouter.use('/content_providers/', require('./routes/dashboard_routes/content_providers'));
apiRouter.use('/title_formatter/', require('./routes/dashboard_routes/title_formatter'));


app.use('/api/v1/eng/', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message: err.message});
    if (err.status != 404) {
        console.log(err.stack);
    }
});

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    console.log('Environment: ' + app.get('env'));
});
