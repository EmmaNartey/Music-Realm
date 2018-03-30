var moment = require('moment');


exports.song = function(row) {
    return {
        id: row.id,
        artist: row.artist,
        title: row.title,
        description: row.description,
        pub_date: moment(row.published_date).format('YYYY-MM-DD HH:mm:ss'),
        thumbnail: {
            url: row.thumbnail_url,
            desc: row.thumbnail_desc
            },
        source: row.source,
        insert_ts: moment(row.insert_ts).format('YYYY-MM-DD HH:mm:ss')
    };
}