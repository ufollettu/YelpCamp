var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
// // // add static files like stylesheet
// // app.use(express.static("public"));
//seeding database
seedDB();
// app.set("views", "/views/campgrounds");

//Routes
//Landing page
app.get("/", function (req, res) {
    res.redirect("/campgrounds");
});
//INDEX
app.get('/campgrounds',function(req,res) {
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
app.get('/campgrounds/:id/comments/new',function(req,res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground:campground});
        }
    });
});

//Create
app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                    // console.log(req.body.comment);
                    // console.log(campground);
                }
            });
        }
    });
});



//handle URL errors --> always at the end of the routes
app.get("*", function (req, res) {
    res.send("sorry page not found!");
});

// Tell express to listen
app.listen(4000, function() {
    console.log('YelpCamp at 4000');
});