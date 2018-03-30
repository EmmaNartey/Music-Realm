var express = require('express');
var router = express.Router();
var db = require('../../db');
var _ = require('lodash');
var utils = require('../../utils');
var validator = require('validator');
var converters = require('../../converters');


router.get('/', function(req, res, next) {
    req.checkQuery('content_provider', 'content_provider required').notEmpty();
    req.checkQuery('limit', 'should be integer').optional().isInt();
    req.checkQuery('offset', 'should be integer').optional().isInt();


    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var limit = validator.toInt(req.query.limit) || 15;
    var offset = validator.toInt(req.query.offset) || 0;
   
    var baseQuery = db.from('rss')

    var dataQuery = baseQuery.clone()
        .select('*')
        .from('rss')
		.where('content_provider',req.query.content_provider)
		.orderBy('id')
		.limit(limit).offset(offset)

    var cntQuery = baseQuery.clone().count('* as cnt');

    var nextUrl, prevUrl;

    cntQuery.then(function(rows) {
        var cnt = validator.toInt(rows[0].cnt);

        if ((limit + offset) < cnt) {
            nextUrl = utils.modifyQueryString(req, {offset: offset + limit});
        }

        if (offset > 0) {
            prevUrl = utils.modifyQueryString(req, {offset: offset > limit ? offset - limit : 0})
        }

        return dataQuery;
    }).then(function(rows) {
        db('rss')
        .where('content_provider',req.query.content_provider)
        .count('id as count')
            .then(function(mCount){
                var resData = {
                    count: mCount[0].count,
                    rss: rows.map(function(row) {
                        return {
                            id: row.id,
                            source: row.source,
                            content_provider: row.content_provider,
                            health: row.health,
                            edition: row.edition
                        }
                    }),
                    paging: {
                        next: nextUrl,
                        prev: prevUrl
                    }
            };

            res.send(resData);
        }).catch(next);
    }).catch(next);
});


router.post('/delete', function(req, res, next) {
    req.checkBody('id', 'id required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.del()
        .from('rss')
        .where('id', req.body.id)
        .then(function(rows) {
            res.sendStatus(200);
        })
        .catch(next);
});

router.get('/get', function(req, res, next) {
    req.checkQuery('id', 'id required').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('*')
        .from('rss')
        .where('id',req.query.id)
        .then(function(rows) {
            if (rows.length > 0) //meaning sth found
            {
                res.status(409).send(rows);
            }
            else{    //user existeth not
                res.sendStatus(404);
            }
        })

        .catch(next);
});

router.post('/update', function(req, res, next) {
    req.checkBody('edition', 'edition required').notEmpty();
    req.checkBody('content_provider', 'cp required').notEmpty();
    req.checkBody('source', 'source required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db('rss')
        .where('id', '=', req.body.id)
        .update({
            source: req.body.source,
            health: "1",
            edition: req.body.edition,
            content_provider: req.body.content_provider
        })
        .then(function (rows) {
            res.sendStatus(200);            
        })

        .catch(next);

});


router.post('/add', function(req, res, next) {
    req.checkBody('edition', 'edition required').notEmpty();
    req.checkBody('content_provider', 'cp required').notEmpty();
    req.checkBody('source', 'source required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('id')
        .from('rss')
        .where('source', req.body.source)
        .then(function(rows) {
            if (rows.length > 0) {
                res.status(409).send(rows[0].id.toString());
            } else {
                db.insert({
                    source: req.body.source,
                    health: "1",
                    edition: req.body.edition,
                    content_provider: req.body.content_provider
                })
                .into('rss')
                .then(function(ids) {
                    res.status(201).send(ids[0].toString());
                })
                .catch(next);
            }
        })
        .catch(next);
});

router.post('/toggle', function(req, res, next) {

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var query = db.raw(
        'UPDATE `music-realm`.rss SET health = 1 - health WHERE id =?', [req.body.id]);
        query.then(function(response) {
            var string = JSON.stringify(response);
            var json =  JSON.parse(string);
            if (json[0].affectedRows > 0) {
                res.sendStatus(200);
            }else{    
                res.sendStatus(404);
            }
        })
        .catch(next);
});

module.exports = router;