/*declerations */

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");


seedDB();

/* mongodb connection setup and check */
var uri = 'mongodb://asaraswat:temp1234@cluster0-shard-00-00-g8kxf.mongodb.net:27017,cluster0-shard-00-01-g8kxf.mongodb.net:27017,cluster0-shard-00-02-g8kxf.mongodb.net:27017/y_camp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(uri);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
console.log("crap");
db.once('open', function callback() {
    console.log("Connected");
});


/* routes */


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, campgrounds) {

        if (err) {
            console.log(" campgrounds route" + err);
        } else {
            res.render("campgrounds/campgrounds", {
                camgroundsData: campgrounds
            });
        }
    });


});

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

/* post route for adding campgrounds */
app.post("/campgrounds", function (req, res) {
    var newCampground = {
        name: req.body.groundName,
        url: req.body.groundUrl,
        description: req.body.groundDescription
    };
    Campground.create({
        name: newCampground.name,
        url: newCampground.url,
        description: newCampground.description
    }, function (err, cGrounds) {
        if (err) {
            console.log("campground addition by user: " + err);
        } else {
            res.redirect("/campgrounds");
        }
    });

});
/* route to a particular campground */


app.get("/campgrounds/:id", function (req, res) {

    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampGround) {
        if (err) {
            console.log(err);
        } else {
            //console.log(foundCampGround);
            res.render("campgrounds/show", {
                campground: foundCampGround
            });
        }
    });

});

/* comments route */
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("bad shit in campground comments");
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });


});

/* posting of the comment */
app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("bad shit in campground display comments");
            res.redirect("/campgrounds");
        } else {
            var newComments = {
                text: req.body.textComment,
                author: req.body.authorComment,
            };
            Comment.create({
                text: newComments.text,
                author: newComments.author
            }, function (err, comment) {
                if (err) {
                    console.log("comment addition by user: " + err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });

        }
    });
});

app.listen(3000, function () {
    console.log("yelp camp is running");
});