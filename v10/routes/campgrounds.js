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
            // render the show template
            console.log(foundCampground);
            res.render('campgrounds/show', {campground:foundCampground});
        }
    });
});
//EDIT
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE
router.put("/:id", checkCampgroundOwnership, function (req, res) {
    //find und update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }

    });
});

//DESTROY
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//auth middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// campground ownership middleware
function checkCampgroundOwnership(req, res, next) {
    //is user logged?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                // console.log(err);
                res.redirect("back");
            } else {
                //does the user own campground?
                if (foundCampground.author.id.equals(req.user._id)) { // triple = not working because foundCampground.author.id is a mongoose Object, and req.user._id is a String. Use .equals instead
                    console.log(foundCampground);
                    next() // cb
                } else {
                    //otherwise redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        //if not, redirect
        res.redirect("back");
    }
}

module.exports = router;