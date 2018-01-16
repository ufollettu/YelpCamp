var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    // Campground = require("./models/campground"),
    // Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// Requiring Routes
var commentsRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");

// add static files like stylesheet
app.use(express.static(__dirname + "/public"));

// seeding database
seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "non so cosa sia",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass if user is authenticated to ALL routes
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);

//handle URL errors --> always at the end of the routes
app.get("*", function (req, res) {
    res.send("sorry page not found!");
});

// Tell express to listen
app.listen(4000, function() {
    console.log('YelpCamp at 4000');
});