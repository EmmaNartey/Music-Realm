var Promise = require("bluebird");
var request = require("request");
var FeedParser = require('feedparser');
var readability = Promise.promisify(require('node-readability'));
var cheerio = require('cheerio');
var moment = require('moment');
var getYouTubeID = require('get-youtube-id');
var _ = require('lodash');
var url = require('url');
var iconv = require('iconv-lite');
require('colors');
var dbCrawler = require('./db_crawler');
var dbMain = require('./db_main');

var topic_breaking = 22;

dbMain('news').max('insert_ts as maxInsertTs')
    .then(function (row) {
        console.log(row[0].maxInsertTs);
        dbCrawler('news').where('insert_ts', '>', row[0].maxInsertTs === null? '0': row[0].maxInsertTs)
            .map(function(article) {
                return _insertArticle(article)
                    .catch(function(err) {
                        console.error('Error inserting:'.red, article.title, err.toString());
                    });
            }, {concurrency: 1})
    })
    .then(_deleteOld)
    .then(_updateCounters)
    .then(function() {
        console.log('All articles were inserted.'.green);
        process.exit(0);
    })
    .catch(function(err) {
        console.error('Processing aborted.'.red, err);
        process.exit(-1);
    });

function _insertArticle(article) {
    
    return dbMain('news').insert({
            type: article.type,
            title: article.title,
            description: '',
            published_date: article.published_date,
            thumbnail_url: article.thumbnail_url, 
            thumbnail_desc: article.thumbnail_desc,
            images: article.images,
            content: article.content,
            preview: article.preview,
            readMore: article.readMore, 
            author: article.author,
            video: article.video,
            source: article.source,
            content_provider: article.content_provider,
            topic: article.topic,
            insert_ts: article.insert_ts
        }).then(function(ids) {

            if (!!article.is_breaking) {
                pushBreakingNews(article.content_provider, ids[0], article.topic);
            };
        });
}

function _updateCounters() {
    console.log('Updating topics_content_providers.');

    return dbMain('topics_content_providers').then(function(rows) {
        return Promise.map(rows, function(row) {
            switch (row.topic) {
                case 5:
                    return dbMain('topics_content_providers').where('id', row.id).update({
                        news: dbMain.raw(
                            '(SELECT id FROM news ' +
                            'WHERE content_provider = ? ' +
                            'AND comments_count > 0 ' +
                            "AND thumbnail_url > ''" +
                            'ORDER BY comments_count DESC, published_date DESC LIMIT 1)',
                            [row.content_provider]),
                        news_count: dbMain.raw(
                            '(SELECT COUNT(*) FROM news WHERE comments_count > 0 AND content_provider = ?)',
                            [row.content_provider])
                    });
                    break;

                case 8:
                    return dbMain('topics_content_providers').where('id', row.id).update({
                        news: dbMain.raw(
                            '(SELECT id FROM news ' +
                            'WHERE content_provider = ? ' +
                            "AND thumbnail_url > '' " +
                            'AND likes_count > 0 ' +
                            'ORDER BY likes_count DESC, published_date DESC LIMIT 1)',
                            [row.content_provider]),
                        news_count: dbMain.raw(
                            '(SELECT COUNT(*) FROM news WHERE likes_count > 0 AND content_provider = ?)',
                            [row.content_provider])
                    });
                    break;

                default:
                    return dbMain('topics_content_providers').where('id', row.id).update({
                        news: dbMain.raw(
                            '(SELECT id FROM news ' +
                            'WHERE topic = ? AND content_provider = ? ' +
                            "AND thumbnail_url > ''" +
                            'ORDER BY published_date DESC LIMIT 1)',
                            [row.topic, row.content_provider]),
                        news_count: dbMain.raw(
                            '(SELECT COUNT(*) FROM news WHERE topic = ? AND content_provider = ?)',
                            [row.topic, row.content_provider])
                    });
            }
        }, {concurrency: 1});
    });
}

function _deleteOld() {
    console.log('Deleting old posts.');
    return dbMain('news').where('published_date', '<', moment().subtract(20, 'days').format('YYYY-MM-DD')).delete();
}

function pushBreakingNews(content_provider, articleId, topicId) {
    console.log('Push Breaking News');

    dbMain('editions').join('content_providers', 'editions.id', 'content_providers.edition')
        .where('content_providers.id', content_provider)
        .then(function(rows) {
        var edition = rows[0].edition;
        var topicBreakingNews = '/topics/'+edition+'-breaking-test';
        console.log('topicBreakingNews: '+topicBreakingNews);

        var options = { method: 'POST',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: 
           { 'postman-token': 'ac7f5c0c-8cad-2c6c-2166-9aa180bda281',
             'cache-control': 'no-cache',
             authorization: 'key=AIzaSyB6kjTq_g46KLWyPjdoxlgfND7FoMRlKxI',
             'content-type': 'application/json' },
          body: { to: topicBreakingNews, data: { article: { id: articleId, topic: topicId } } },
          json: true };

        request(options, function (error, response, body) {
            if(error){
                console.error(error);
            }else{
                console.log(body);
            }
        });
    });
}


