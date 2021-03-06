var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

//Landing page
router.get("/", function (req, res) {
    res.redirect("/campgrounds");
});

//show register form
router.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
router.post("/register", function (req, res) {
    User.register(new User({username:req.body.username}), req.body.password, function (err, user){
        if (err) {
            req.flash("error", err.message);
            return res.render("register", {error: err.message}); //different from the lecture when return res.render
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds/",
    failureRedirect: "/login"
}), function (req, res) {});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

module.exports = router;