var url = require('url');
var querystring = require('querystring');
var _ = require('lodash');

exports.modifyQueryString = function(req, data) {
    var curUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var parsed = url.parse(curUrl, true);

    _.extend(parsed.query, data);
    _.each(parsed.query, function(v, k) {
        if(_.isNull(v)) {
            delete parsed.query[k];
        }
    });
    parsed.search = querystring.stringify(parsed.query);
    //console.log(url.format(parsed));
    return url.format(parsed);
};