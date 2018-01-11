// Reference

var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema);

//Embed

// var mongoose = require("mongoose");
//
// var comment = new mongoose.Schema({
//     text: String,
//     author: String
// });
//
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String,
//     comments: [comment]
// });
//
// module.exports = mongoose.model("Campground", campgroundSchema);
