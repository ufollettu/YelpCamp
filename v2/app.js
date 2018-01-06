var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// // // add static files like stylesheet
// // app.use(express.static("public"));
app.set("view engine", "ejs");

//Schema Setup

var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//         name: "Rock Tree",
//         image: "http://www.gonews.it/wp-content/uploads/2014/02/campeggio1.jpg",
//         description: "Harry is not my friend"
//     },
//     function (err, campground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('newly create camp');
//         console.log(campground);
//     }
// });


// var campgrounds;
// campgrounds = [
//     {name: "Pino", image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg"},
//     {name: "Betulla", image: "https://farm5.staticflickr.com/4101/4961777592_322fea6826.jpg"},
//     {name: "Quercia", image: "https://farm2.staticflickr.com/1266/973330600_c1360f7cd3.jpg"}
// ];

//Routes
//Landing page
app.get("/", function (req, res) {
    res.render("landing");
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
    res.render('new.ejs');
});
//SHOW
app.get('/campgrounds/:id', function (req, res) {
    //find correct campground ID
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
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