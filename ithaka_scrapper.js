/***********************************************

    Name:    Scrapper for goodreads.com
    Action:  Scrapes all the quotes
    Auther:  Komaldeep

************************************************/
var converter = require('json-2-csv');
var express = require('express');
var Twit = require('twit');
var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/',function(req,res){
       
     res.sendFile(path.join(__dirname+'/index.html'));

});

app.get('/scrape', function(req, res) {
    // Let's scrape Anchorman 2
    url = 'http://www.goodreads.com/quotes/tag/travel';

    var allLinks = [];
    var array = [];

    request(url, function(error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);
            var page;

            $('.next_page').each(function() {
                var data = $(this);
                page = data.prev();
                page = page.text();
            })

            for (var i = 0; i < page; i++) {
                allLinks[i] = url + "?page=" + (i + 1);
            };

            goToLinks(allLinks);

        }

        res.sendFile(path.join(__dirname+'/tweet.html'));
    });

    var goToLinks = function(allLinks) {
        for (var i = 0; i < allLinks.length; i++) {
            var link = allLinks[i];
            scrapeLink(link);
        }
    };

    var scrapeLink = function(link) {
        request(link, function(error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);


                $('.quoteText').each(function() {
                    var quote;
                    var author;
                    var source;
                    var data = $(this);
                    temp = data.text();
                    temp = temp.trim();
                    part = temp.split('\n');
                    quote = part[0];
                    author = part[2];
                    author = author.trim();
                    source = part[4];
                    //source = source.trim();

                    var metaData = {
                        quote: quote,
                        author: author,
                        source: source
                    };
                    array.push(metaData);

                });
                console.log(array)
                writeToFile(array);
            }
        });
    };
    var count = 1;
    var writeToFile = function(json) {
        /*
        var content = stringify(quote, {header: false}, function(err, output) {
            fs.appendFileSync('output.csv', output, {encoding: 'utf8'});
        });*/
        fs.writeFile('output.json', JSON.stringify(json, null, " "), function(err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
        });
        console.log("done" + count);
        count++;
    };
})

app.get('/twit', function(req, res) {
    var T = new Twit({
        consumer_key: 'IJ9wqHqDfyJ0Vr4MpEQTDYFt3',
        consumer_secret: 'HJqG4aXXJJis4kZepS1tTWOMA6D0wB2pO1wkCbTQJWCw5orref',
        access_token: '2180620039-C7Mh4PJOYvAz4wfzqdDwicy1m8B6rygUrqxQazE',
        access_token_secret: 'mTNLdFZ01M2uGGDDtLbEOJtdE9rypyh3GjUX7IKD1llXl'
    });

    T.post('statuses/update', {
        status: 'hello world!'
    }, function(err, data, response) {
        console.log(data)
    })

});

var json2csvCallback = function (err, csv) {
    if (err) throw err;
    console.log(csv);
};
// Configuring the ports
app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
