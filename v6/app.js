var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    // LocalStrategyMongoose = require("passport-local-mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

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

//Routes
//Landing page
app.get("/", function (req, res) {
    res.redirect("/campgrounds");
});
//INDEX
app.get('/campgrounds',function(req,res) {
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
app.post('/campgrounds',function(req,res) {
    //get data from form and add to DB
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description:description};
    // create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
//NEW
app.get('/campgrounds/new',function(req,res) {
    res.render('campgrounds/new');
});
//SHOW
app.get('/campgrounds/:id', function (req, res) {
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
// ======================
// Comment Routes
// ======================
//
// New
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground:campground});
        }
    });
});

//Create--> with referenced Schema
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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
                        campground.comments.push(comment);
                        campground.save();
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });
        }
    });
});

// //Create--> with embedded Schema
// app.post("/campgrounds/:id/comments", function (req, res) {
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


//===========
//Auth Routes
//===========
//show register form
app.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function (req, res) {
    User.register(new User({username:req.body.username}), req.body.password, function (err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function (req, res) {
    res.render("login");
});
//handle login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {});

//logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

//handle URL errors --> always at the end of the routes
app.get("*", function (req, res) {
    res.send("sorry page not found!");
});

// Tell express to listen
app.listen(4000, function() {
    console.log('YelpCamp at 4000');
});