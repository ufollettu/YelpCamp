var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// // // add static files like stylesheet
// // app.use(express.static("public"));
app.set("view engine", "ejs");

var campgrounds;
campgrounds = [
    {name: "Pino", image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg"},
    {name: "Betulla", image: "https://farm5.staticflickr.com/4101/4961777592_322fea6826.jpg"},
    {name: "Quercia", image: "https://farm2.staticflickr.com/1266/973330600_c1360f7cd3.jpg"}
];

//Routes

app.get("/", function (req, res) {
    res.render("landing");
});

app.get('/campgrounds',function(req,res) {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds',function(req,res) {
    //get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image:image};
    campgrounds.push(newCampground);
    //redirect to campgrounds page
    res.redirect("/campgrounds");
});

app.get('/campgrounds/new',function(req,res) {
    res.render('new.ejs');
});

//handle URL errors --> always at the end of the routes
app.get("*", function (req, res) {
    res.send("sorry page not found!");
});

// Tell express to listen
app.listen(4000, function () {
    console.log('YelpCamp at 4000');
});