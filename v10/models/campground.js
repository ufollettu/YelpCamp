var mongoose = require("mongoose");

// var Comment = require("./comment");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { usePushEach: true });

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

module.exports = mongoose.model("Campground", campgroundSchema);