var express = require("express");
var router = express.Router({mergeParams: true}); // {mergeParams: true} to pass the campground :id to the comment routes

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

//Create--> with referenced Schema
router.post("/", isLoggedIn, function (req, res) {
    Comment.create(req.body.comment, function (err, comment) {
        if (err) {
            console.log(err);
        } else {
            Campground.findOne({"_id": req.params.id})
                .populate("comments")
                .exec(function (err, campground) {
                    if (err) {
                        console.log(err);
                        res.redirect("/campgrounds");
                    } else {
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username; // to post username to author field in comments
                        comment.save();
                        // console.log(req.user.username);
                        campground.comments.push(comment);
                        campground.save();
                        // console.log(comment);
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });
        }
    });
});

// //Create--> with embedded Schema
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
router.get("/:comment_id/edit", function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
});

// Update
router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, {new: true})
        .exec(function(err, updatedComment){
            if (err) {
                res.redirect("back");
            } else {
                console.log("this is the new comment" + updatedComment);
                res.redirect("/campgrounds/" + req.params.id);
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