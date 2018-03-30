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
   
    var baseQuery = db.from('editions')

    var dataQuery = baseQuery.clone()
        .select('*')
        .from('editions')
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
        db('editions')
        .count('id as count')
            .then(function(mCount){
                var resData = {
                        count: mCount[0].count,
                        editions: rows.map(function(row) {
                            return {
                                id: row.id,
                                name: row.name,
                                thumbnail: row.thumbnail
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
        .from('editions')
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


router.get('/countries', function(req, res, next) {
    db.select('*')
        .from('all_countries')
        .then(function(rows) {
            if (rows.length > 0) //meaning exists
            {
                res.status(409).send(rows);
            }
            else{    //user existeth not
                res.sendStatus(404);
            }
            })

        .catch(next);
});



router.post('/delete', function(req, res, next) {
    req.checkBody('id', 'id required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.del()
        .from('editions')
        .where('id', req.body.id)
        .then(function(rows) {
            res.sendStatus(200);
        })
        .catch(next);
});

router.post('/add', function(req, res, next) {
    req.checkBody('name', 'name required').notEmpty();
    req.checkBody('thumbnail', 'thumbnail required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('id')
        .from('editions')
        .where('name', req.body.name)
        .then(function(rows) {
            if (rows.length > 0) {
                res.status(409).send(rows[0].id.toString());
            } else {
                db.insert({
                    name: req.body.name,
                    thumbnail: req.body.thumbnail
                })
                    .into('editions')
                    .then(function(ids) {
                        res.status(201).send("1");
                    })
                    .catch(next);
            }
        })
        .catch(next);
});

module.exports = router;