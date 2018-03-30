var mysql = require('mysql');



var knex = module.exports = require('knex')({
    client: 'mysql',
    connection: process.env.DATABASE_URL || 'mysql://bigdee:bigdee2010@localhost/music-realm',
    debug    :  true
});
