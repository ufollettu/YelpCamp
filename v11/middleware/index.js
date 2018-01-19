var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //is user logged?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                // console.log(err);
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                //does the user own campground?
                if (foundCampground.author.id.equals(req.user._id)) { // triple = not working because foundCampground.author.id is a mongoose Object, and req.user._id is a String. Use .equals instead
                    console.log(foundCampground);
                    next() // cb
                } else {
                    //otherwise redirect
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        //if not, redirect
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    //is user logged?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                // console.log(err);
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                //does the user own comment?
                if (foundComment.author.id.equals(req.user._id)) { // triple = not working because foundCampground.author.id is a mongoose Object, and req.user._id is a String. Use .equals instead
                    // console.log(foundComment);
                    next() // cb
                } else {
                    //otherwise redirect
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        //if not, redirect
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = middlewareObj;