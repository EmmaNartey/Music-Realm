var db = require('./db');
var FeedParser = require('feedparser');
var request = require('request');
var Promise = require("bluebird");
var moment = require('moment');
var cheerio = require('cheerio');
require('colors');


db('rss').join('title_formatter', 'rss.id', 'title_formatter.id')
         .where({'rss.health': 1})
    .then(function(rows) {
        //console.log(rows);
        return rows;
    }).map(function(feed) {
        return downloadFeed(feed)
            .then(processFeed)
            .catch(function(err) {
                console.error('Error processing:'.red, feed.source, err.toString());
            });
    }, {concurrency: 1})
    .then(function() {
        console.log('All feeds were processed.'.green);
        process.exit(0);
    })
    .catch(function(err) {
        console.error('Processing aborted.'.red, err);
        process.exit(-1);
    });


function downloadFeed(feed) {
    console.log('Downloading feed:'.blue, feed.source);

    var req = request(feed.source, {timeout: 10000, pool: false});
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36');

    var feedparser = new FeedParser();

    feed.data = {
        meta: null,
        posts: []       
    };

    return new Promise(function(resolve, reject) {
        req.on('error', reject);
        req.on('response', function(res) {
            if (res.statusCode != 200)
                return this.emit('error', new Error('Bad status code: ' + res.statusCode));
            res.pipe(feedparser);
        });

        feedparser.on('error', reject);
        feedparser.on('end', function() {
            resolve(feed);
        });
        feedparser.on('meta', function(meta) {
            feed.data.meta = meta;
        });
        feedparser.on('data', function(post) {
            //console.log(post);
            feed.data.posts.push(post);
        });
    });
}

function processFeed(feed) {
    console.log('Processing feed:'.magenta, feed.source);

    if (feed.data.posts.length === 0) {
        throw new Error('Empty feed.');
    }

    return Promise.map(feed.data.posts, function(post) {
        return processPost(post, feed);
    }, {concurrency: 5});
}

function processPost(post, feed) {
    console.log('processPost '.gray, post.link);
        return Promise.try(function() {
            var cleanedTitle = _extractTitle(post, feed).trim();
            if (cleanedTitle.indexOf(feed.unwantedSuffix) !== -1) {
                cleanedTitle = cleanedTitle.split(feed.unwantedSuffix)[0];
            }

            return db('songs').where('title', cleanedTitle).then(function(rows){
                if (rows.length > 0) {
                        console.log('Post already in database: '.gray, cleanedTitle);
                }else {
                    return db('songs').insert({
                        title: cleanedTitle,
                        artiste: _extractArtiste(post, feed).trim(),
                        description: post.summary || '',
                        pub_date: post.pubdate,
                        thumbnail: _extractImage(post.description),
                        source: _extractSource(post.description),
                        link: post.link,
                        dirtytitle: post.title 
                    });
                };
            }).catch(function(error) {
                console.error('Error processing post:'.red, post.link, error);
            });
    });
}

function _extractTitle(post, feed) {
    var secondAndThirdParts = post.title.split(feed.firstSeperator)[1];
    if (secondAndThirdParts.indexOf(feed.secondSeperator) !== -1) {
        return secondAndThirdParts.split(feed.secondSeperator)[0];
    }else{
        return secondAndThirdParts;
    }
}

function _extractArtiste(post, feed) {
    var firstpart = post.title.split(feed.firstSeperator)[0];
    var secondAndThirdParts = post.title.split(feed.firstSeperator)[1];
    if (secondAndThirdParts.indexOf(feed.secondSeperator) !== -1) {
        return firstpart.concat('ft.', secondAndThirdParts.split(feed.secondSeperator)[1]);   
    }else if (secondAndThirdParts.indexOf(feed.secondSeperator) !== -1) {
        return firstpart.concat('ft.', secondAndThirdParts.split(feed.secondSeperator)[1]);  
    }else{    
        return firstpart;
    }    
}

function _extractImage(description) {
    var images = [];
    var $ = cheerio.load(description);
    $('img').each(function() {
        images.push({
            link: this.attribs.src || '',
            desc: this.attribs.alt || ''
        });
    });

    return images.length>0? images[0].link: 'no image found';
}

function _extractSource(description) {
    var source = [];
    var $ = cheerio.load(description);
    $('a').each(function() {
        source.push({
            link: this.attribs.href || ''
        });
    });

    return source[0].link;
}
