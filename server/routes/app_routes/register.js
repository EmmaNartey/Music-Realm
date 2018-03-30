var express = require('express');
var router = express.Router();
var db = require('../../db');


router.post('/', function(req, res, next) {
    req.checkBody('username', 'invalid length').len(3, 80);
    req.checkBody('email', 'email required').isEmail().len(5, 100);
    req.checkBody('thumbnail', 'required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json(errors);
        return;
    }

    db.select('id')
        .from('users')
        .where({email: req.body.email})
        .then(function(rows) {
            if (rows.length > 0) {
                res.status(409).send(rows[0].id.toString());
            } else {
                db.insert({
                        name: req.body.username,
                        email: req.body.email,
                        thumbnail: req.body.thumbnail
                    })
                    .into('users')
                    .then(function(ids) {
                        res.status(201).send(ids[0].toString());
                    })
                    .catch(next);
            }
        })
        .catch(next);
});

module.exports = router;