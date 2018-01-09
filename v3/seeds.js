var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    data = [
        {
            name: "Rock Tree",
            image: "http://www.eventilagodicomo.it/wp-content/uploads/2016/05/campeggi-lago-di-garda-5.jpg",
            description: "Harry is my friend"
        },
        {
            name: "Pop Tree",
            image: "http://www.gonews.it/wp-content/uploads/2014/02/campeggio1.jpg",
            description: "Harry is not my friend"
        },
        {
            name: "Jazz Tree",
            image: "https://cache-graphicslib.viator.com/graphicslib/thumbs674x446/5381/SITours/safari-in-campeggio-di-tre-giorni-ad-ayers-rock-olgas-e-kings-canyon-in-alice-springs-138453.jpg",
            description: "Maybe Harry is my friend"
        }
    ];

function seedDB() {
    //remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("remove campgrounds");
            // add new campground
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('added camp');
                        // console.log(data);
                        //create a comment
                        Comment.create({
                            text: "questo è un commento",
                            author: "Primo Drudi"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;