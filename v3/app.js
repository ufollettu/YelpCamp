var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

//seeding database
seedDB();


app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// // // add static files like stylesheet
// // app.use(express.static("public"));

app.set("view engine", "ejs");

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
            res.render('index', {campgrounds: campgrounds});
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
    res.render('new');
});
//SHOW
app.get('/campgrounds/:id', function (req, res) {
    //find correct campground ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render the show template
            res.render('show', {campground:foundCampground});
        }
    })
});

//handle URL errors --> always at the end of the routes
app.get("*", function (req, res) {
    res.send("sorry page not found!");
});

// Tell express to listen
app.listen(4000, function () {
    console.log('YelpCamp at 4000');
});