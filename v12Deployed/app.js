var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    flash = require("connect-flash");
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    // Campground = require("./models/campground"),
    // Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var PORT = process.env.PORT || 4000;

// Requiring Routes
var commentsRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { useMongoClient: true });

// mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true }); //local db
// mongoose.connect("mongodb://ufollettu:radiohead@ds263367.mlab.com:63367/yelpdevcamp", { useMongoClient: true }); //mlab db
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
// add static files like stylesheet
app.use(express.static(__dirname + "/public"));
//methodOverride
app.use(methodOverride("_method"));
//flash message display
app.use(flash());

// seeding database
// seedDB();

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

app.use(function (req, res, next) {
    // pass if user is authenticated to ALL routes
    res.locals.currentUser = req.user;
    // pass flash message to all routes
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

//handle URL errors --> always at the end of the routes
app.get("*", function (req, res) {
    res.send("sorry page not found!");
});

// Tell express to listen
app.listen(PORT, function() {
    console.log("YelpCamp at " + PORT);
});

// app.listen(4000, function() {
//     console.log('YelpCamp at 4000');
// });