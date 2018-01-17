var express = require("express");
var router = express.Router({mergeParams: true}); // {mergeParams: true} to pass the campground :id to the comment routes
var mongoose = require("mongoose");
var Campground = require("../models/campground"),
    Comment = require("../models/comment");

// New
router.get('/new', isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground:campground});
        }
    });
});

//Create--> with referenced Schema  for  "mongoose": "^4.11.9",
//
router.post("/", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    // req.flash('success', 'Created a comment!');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//Create--> with referenced Schema mongoose 5.0.0
//
// router.post("/", isLoggedIn, function (req, res) {
//     Comment.create(req.body.comment, function (err, comment) {
//         if (err) {
//             console.log(err);
//         } else {
//             Campground.findOne({"_id": req.params.id})
//                 .populate("comments")
//                 .exec(function (err, campground) {
//                     if (err) {
//                         console.log(err);
//                         res.redirect("/campgrounds");
//                     } else {
//                         comment.author.id = req.user._id;
//                         comment.author.username = req.user.username; // to post username to author field in comments
//                         comment.save();
//                         // console.log(req.user.username);
//                         campground.comments.push(comment);
//                         campground.save();
//                         // console.log(comment);
//                         res.redirect("/campgrounds/" + campground._id);
//                     }
//                 });
//         }
//     });
// });

// //Create--> with embedded Schema
//
// router.post("/", function (req, res) {
//     // find the correct campground
//     Campground.findById(req.params.id, function (err, campground) {
//         if (err) {
//             console.log(err);
//             res.redirect("/campgrounds");
//         } else {
//             Comment.create(req.body.comment, function (err, comment) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     campground.comments.push(comment);
//                     campground.save();
//                     res.redirect("/campgrounds/" + campground._id);
//                     // console.log(req.body.comment);
//                     // console.log(campground.comments);
//                 }
//             });
//         }
//     });
// });

// Edit
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
});

// Update (for  mongoose 5.0.0)
// router.put("/:comment_id", function (req, res) {
//     Comment.findOneAndUpdate(
//         {"_id": req.params.comment_id},
//         {"$set": {"text": req.body.comment.text}},
//         function (err, comment) {
//             if (err) {
//                 res.redirect("back");
//             }
//                 res.redirect("/campgrounds/" + req.params.id);
//         }
//     );
// });

// Update for  "mongoose": "^4.11.9",
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            res.render("edit");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id,  function(err){
        if(err){
            res.render("edit");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

function checkCommentOwnership(req, res, next) {
    //is user logged?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                // console.log(err);
                res.redirect("back");
            } else {
                //does the user own comment?
                if (foundComment.author.id.equals(req.user._id)) { // triple = not working because foundCampground.author.id is a mongoose Object, and req.user._id is a String. Use .equals instead
                    // console.log(foundComment);
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

//passport middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;