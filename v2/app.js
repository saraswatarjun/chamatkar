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
            res.render("campgrounds", {
                camgroundsData: campgrounds
            });
        }
    });


});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
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
            console.log("Campground added" + newCampground.name);
            res.redirect("/campgrounds");
        }
    });

});
/* route to a particular campground */


app.get("/campgrounds/:id", function(req, res) {

    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampGround) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampGround);
            res.render("show", {
                campground: foundCampGround
            });
        }
    });

});

app.listen(3000, function () {
    console.log("yelp camp is running");
});