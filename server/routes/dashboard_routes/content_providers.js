var express = require('express');
var router = express.Router();
var db = require('../../db');
var _ = require('lodash');
var utils = require('../../utils');
var validator = require('validator');
var converters = require('../../converters');


router.get('/', function(req, res, next) {
    req.checkQuery('limit', 'should be integer').optional().isInt();
    req.checkQuery('offset', 'should be integer').optional().isInt();


    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var limit = validator.toInt(req.query.limit) || 15;
    var offset = validator.toInt(req.query.offset) || 0;
   
    var baseQuery = db.from('content_providers')

    var dataQuery = baseQuery.clone()
        .select('*')
        .from('content_providers')
        .orderBy('name')
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
        db('content_providers')
        .count('id as count')
            .then(function(mCount){
                var resData = {
                        count: mCount[0].count,
                        content_providers: rows.map(function(row) {
                            return {
                                id: row.id,
                                name: row.name,
                                favicon: row.favicon,
                                description: row.description,
                                edition: row.edition,
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


router.get('/get', function(req, res, next) {
    req.checkQuery('id', 'id required').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('*')
        .from('content_providers')
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

router.get('/get_edition', function(req, res, next) {
    req.checkQuery('edition', 'edition required').notEmpty();
    req.checkQuery('limit', 'should be integer').optional().isInt();
    req.checkQuery('offset', 'should be integer').optional().isInt();


    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var limit = validator.toInt(req.query.limit) || 15;
    var offset = validator.toInt(req.query.offset) || 0;
   
    var baseQuery = db.from('content_providers')

    var dataQuery = baseQuery.clone()
        .select('*')
        .from('content_providers')
        .where('edition',req.query.edition)
        .orderBy('name')
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
        db('content_providers')
        .where('edition',req.query.edition)
        .count('id as count')
            .then(function(mCount){
                var resData = {
                    count: mCount[0].count,
                    content_providers: rows.map(function(row) {
                    return {
                        id: row.id,
                        name: row.name,
                        favicon: row.favicon,
                        description: row.description,
                        edition: row.edition,
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
        .from('content_providers')
        .where('id', req.body.id)
        .then(function(rows) {
            res.sendStatus(200);
        })
        .catch(next);
});

router.post('/add', function(req, res, next) {
    req.checkBody('edition', 'edition required').notEmpty();
    req.checkBody('name', 'name required').notEmpty();
    req.checkBody('favicon', 'favicon required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('id')
        .from('content_providers')
        .where('name', req.body.name)
        .then(function(rows) {
            if (rows.length > 0) {
                res.status(409).send(rows[0].id.toString());
            } else {
                db.insert({
                    name: req.body.name,
                    favicon: req.body.favicon,
                    edition: req.body.edition
                })
                    .into('content_providers')
                    .then(function(ids) {
                        res.status(201).send("1");
                    })
                    .catch(next);
            }
        })
        .catch(next);
});

router.post('/edit', function(req, res, next) {
    req.checkBody('edition', 'name required').notEmpty();
    req.checkBody('name', 'name required').notEmpty();
    req.checkBody('favicon', 'favicon required').notEmpty();
   
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db('content_providers')
        .where('id', '=', req.body.id)
        .update({
                 edition: req.body.edition,
                 name: req.body.name,
                 favicon: req.body.favicon
        })
        .then(function (rows) {
                res.sendStatus(200);
        })

        .catch(next);

});

module.exports = router;