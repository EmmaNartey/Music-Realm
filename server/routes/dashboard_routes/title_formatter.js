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
   
    var baseQuery = db.from('title_formatter')

    var dataQuery = baseQuery.clone()
        .select('*')
        .from('title_formatter')
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
        db('title_formatter')
        .count('id as count')
            .then(function(mCount){
                var resData = {
                        count: mCount[0].count,
                        title_formatter: rows.map(function(row) {
                            return {
                                id: row.id,
                                firstSeperator: row.name,
                                secondSeperator: row.thumbnail,
                                artistePosition: row.artistePosition,
                                titlePosition: row.titlePosition,
                                ftPosition: row.ftPosition,
                                rss: row.rss,
                                unwantedSuffix: row.unwantedSuffix
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
        .from('title_formatter')
        .where('id', req.body.id)
        .then(function(rows) {
            res.sendStatus(200);
        })
        .catch(next);
});

router.post('/add', function(req, res, next) {
    req.checkBody('firstSeperator', 'firstSeperator required').notEmpty();
    req.checkBody('secondSeperator', 'secondSeperator required').notEmpty();
    req.checkBody('rss', 'rss required').notEmpty();
    req.checkBody('artistePosition', 'artistePosition required').optional();
    req.checkBody('titlePosition', 'titlePosition required').optional();
    req.checkBody('ftPosition', 'ftPosition required').optional();
    req.checkBody('unwantedSuffix', 'unwantedSuffix required').optional();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('id')
        .from('title_formatter')
        .where('firstSeperator', req.body.firstSeperator)
        .then(function(rows) {
            if (rows.length > 0) {
                res.status(409).send(rows[0].id.toString());
            } else {
                db.insert({
                    firstSeperator: req.body.firstSeperator,
                    secondSeperator: req.body.secondSeperator,
                    rss: req.body.rss
                })
                    .into('title_formatter')
                    .then(function(ids) {
                        res.status(201).send("1");
                    })
                    .catch(next);
            }
        })
        .catch(next);
});

module.exports = router;