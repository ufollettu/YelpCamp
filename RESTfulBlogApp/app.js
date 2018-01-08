var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"))
    .use(bodyParser.urlencoded({extended: true}))
    .use(sanitizer())
    .use(methodOverride("_method"));

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

//index route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("this is an error");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

//new route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//create route
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            res.render("new");
        } else{
            res.redirect("/blogs")
        }
    })
});

//show route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog:foundBlog})
        }
    })
});
//edit route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog});
        }
    })
});

//update route
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//delete route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

//listen
app.listen(3000, function () {
    console.log('RESTful at 3000');
});