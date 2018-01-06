var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "test",
//     image: "https://i.vimeocdn.com/portrait/9613095_300x300",
//     body: "blog post"
// });

//RESTful Routes
app.get("/", function (req, res) {
    res.redirect("/blogs"); 
})

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("this is an error");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

//listen
app.listen(3000, function () {
    console.log('RESTful at 3000');
});