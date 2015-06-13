/*var path = require('path');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var URL = "http://www.getyourguide.com/s/?q=bangkok";

request("http://www.getyourguide.com/s/?q=bangkok", function (error, response, body) {
  if (!error && response.statusCode == 200) {
        console.log("hay bay");
        console.log(body);
        $ = cheerio.load(body);
        var dave=$('.activity-card-title');
        console.log(dave.length);
        $('.activity-card-content').each(function(i,element) {
          var name= $(element).find('.activity-card-title').text();
          console.log(name);
        });
      }
})*/

var phantom = require('phantom');
var URL = "http://www.gulftalent.com/home/Web-Developer-Salaries-in-UAE-188374.html";
phantom.create(function(site) {
    return site.createPage(function(page) {
        return page.open(URL, function(status) {
            console.log("opened site? ", status);
            page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
                //jQuery Loaded
                setTimeout(function() {
                    return page.evaluate(function() {

                        var h3Arr = [], //array that holds all html for h2 elements
                            pArr = []; //array that holds all html for p elements

                        //Populate the two arrays
                        $('h3').each(function() {
                            h3Arr.push($(this).html());
                        });
/*
                        $('p').each(function() {
                            pArr.push($(this).html());
                        });
*/
                        //Return this data
                        return {
                            h3: h3Arr,
                            /*p: pArr*/
                        }
                    }, function(result) {
                        console.log(result); //Log out the data.
                        site.exit();
                    });
                }, 8000);
            });
        });
    });
});
