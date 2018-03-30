var express = require('express');
var router = express.Router();
var db = require('../../db');
var validator = require('validator');
var utils = require('../../utils');
var moment = require('moment');
var Promise = require("bluebird");

router.get('/', function(req, res, next) {
    req.checkQuery('song', 'should be integer').isInt();
    req.checkQuery('limit', 'should be integer').optional().isInt();
    req.checkQuery('offset', 'should be integer').optional().isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var limit = validator.toInt(req.query.limit) || 15;
    var offset = validator.toInt(req.query.offset) || 0;

    var baseQuery = db
        .from('comments as c')
        .where('song', req.query.song);

    var dataQuery = baseQuery.clone()
        .innerJoin('users as u', 'c.user', 'u.id')
        .select('c.*', 'u.id as user_id', 'u.name as user_name', 'u.thumbnail as user_thumbnail',
                'u.email as user_email')
        .orderBy('c.published_date', 'desc')
        .limit(limit).offset(offset);

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
        var resData = {
            data: {
                comments: rows.map(function(row) {
                    return {
                        id: row.id,
                        body: row.body,
                        pub_date: moment(row.published_date).format('YYYY-MM-DD HH:mm:ss'),
                        upvotes: row.up_votes,
                        downvotes: row.down_votes,
                        user: {
                            id: row.user_id,
                            name: row.user_name,
                            email: row.user_email,
                            thumbnail: row.user_thumbnail
                        },
                        vote_type: row.vote_type
                    }
                }),
                paging: {
                    next: nextUrl,
                    prev: prevUrl
                }
            }
        };

        res.send(resData);
    }).catch(next);
});

router.get('/all_comments', function(req, res, next) {
    req.checkQuery('limit', 'should be integer').optional().isInt();
    req.checkQuery('offset', 'should be integer').optional().isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var limit = validator.toInt(req.query.limit) || 15;
    var offset = validator.toInt(req.query.offset) || 0;

    var baseQuery = db.from('comments as c')

    var dataQuery = baseQuery.clone()
        .select('*')
        .from('comments')
        .orderBy('comments.published_date', 'desc')
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
        db('comments')
        .count('id as count')
          .then(function (mCount){
            var resData = {
                count: mCount[0].count,
                comments: rows.map(function (row) {
                    return {
                        id: row.id,
                        body: row.body,
                        pub_date: moment(row.published_date).format('YYYY-MM-DD HH:mm:ss'),
                        upvotes: row.up_votes,
                        downvotes: row.down_votes,
                        song: row.song,
                        user: row.user
                    }
                }),
                paging: {
                  next: nextUrl,
                  prev: prevUrl                    
                }
            };
            res.send(resData);
          }).catch(next);
    }).catch(next)     
});

router.post('/', function(req, res, next) {
    req.checkBody('song', 'should be integer').isInt();
    req.checkBody('body', 'should not be empty').notEmpty();
    req.checkBody('user', 'should be integer').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).json(errors);
        return;
    }

    var comment = req.body.body;
    if (comment.indexOf('http') > -1) {
        res.sendStatus(400);
        return; 
    };

    Promise.join(
        db('songs').where('id', req.body.song),
        db('users').where('id', req.body.user),
        function(songRows, userRows) {
            if (songRows.length === 0 || userRows.length == 0) {
                res.sendStatus(400);
                return;
            }

            db('comments').insert({
                song: req.body.song,
                user: req.body.user,
                body: req.body.body,
                up_votes: 0,
                down_votes: 0,
                published_date: db.raw('now()')
            }).then(function(ids) {
                res.status(201).send(ids[0].toString());
            }).catch(next);
        }
    ).catch(next);
});

router.post('/:id/upvote', function(req, res, next) {
    db('comments')
        .where('id', req.params.id)
        .increment('up_votes', 1)
        .then(function(cnt) {
            res.sendStatus(cnt > 0 ? 200 : 404)
        })
        .catch(next);
});

router.post('/:id/downvote', function(req, res, next) {
    db('comments')
        .where('id', req.params.id)
        .increment('down_votes', 1)
        .then(function(cnt) {
            res.sendStatus(cnt > 0 ? 200 : 404)
        })
        .catch(next);
});

router.post('/:id/upvote/undo', function(req, res, next) {
    db('comments')
        .where('id', req.params.id)
        .decrement('up_votes', 1)
        .then(function(cnt) {
            res.sendStatus(cnt > 0 ? 200 : 404)
        })
        .catch(next);
});

router.post('/:id/downvote/undo', function(req, res, next) {
    db('comments')
        .where('id', req.params.id)
        .decrement('down_votes', 1)
        .then(function(cnt) {
            res.sendStatus(cnt > 0 ? 200 : 404)
        })
        .catch(next);
});

router.post('/:id/upvote/toggle', function(req, res, next) {
    db('comments')
        .where('id', req.params.id)
        .update({
            'up_votes': db.raw('up_votes - 1'),
            'down_votes': db.raw('down_votes + 1')
        })
        .then(function(cnt) {
            res.sendStatus(cnt > 0 ? 200 : 404)
        })
        .catch(next);
});

router.post('/:id/downvote/toggle', function(req, res, next) {
    db('comments')
        .where('id', req.params.id)
        .update({
            'down_votes': db.raw('down_votes - 1'),
            'up_votes': db.raw('up_votes + 1')
        })
        .then(function(cnt) {
            res.sendStatus(cnt > 0 ? 200 : 404)
        })
        .catch(next);
});

router.get('/:id', function(req, res, next) {

    var errors = req.validationErrors()
    if (errors) {
        res.status(400).json(errors)
        return
    }

    db.select('*')
        .from('comments')
        .where('id', req.params.id)
        .then(function(rows) {
            if (rows.length > 0) //  meaning sth found
            {
                res.status(200).send(rows)
            }
            else{  //  user existeth not
                res.sendStatus(404)
            }
        }).catch(next);
});

module.exports = router;
