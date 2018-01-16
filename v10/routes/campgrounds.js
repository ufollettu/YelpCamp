var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX
router.get('/',function(req,res) {
    // console.log(req.user);
    //Get All Campgrounds on DB
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

//CREATE
router.post('/', isLoggedIn, function(req,res) {
    //get data from form and add to DB
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = { // post user data into campground model
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, image:image, description:description, author:author};
    // console.log(req.user);
    // create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW
router.get('/new',isLoggedIn, function(req,res) {
    res.render('campgrounds/new');
});

//SHOW
router.get('/:id', function (req, res) {
    //find correct campground ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            // render the show template
            res.render('campgrounds/show', {campground:foundCampground});
        }
    });
});

//passport middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;