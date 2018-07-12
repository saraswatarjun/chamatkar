var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

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


/* schema setup */
var campgroundSchema = mongoose.Schema({
    name: String,
    url: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
/* var campgrounds = [{
        name: "park 1",
        image: "https://farm2.staticflickr.com/1227/925559735_5f2350b690.jpg",
        description:"This is park 1"
    },
    {
        name: "park 2",
        image: "https://farm4.staticflickr.com/3474/3907198073_2918b28097.jpg",
        description:"This is park 2"
    },
    {
        name: "park 3",
        image: "https://farm9.staticflickr.com/8035/7930442194_40e37f5ea0.jpg",
        description:"This is park 3"
    },
    {
        name: "park 4",
        image: "https://farm6.staticflickr.com/5080/7004537596_a29365d72f.jpg",
      description:"This is park 4"
    },
    {
        name: "park 5",
        image: "https://farm4.staticflickr.com/3457/3871440451_181099e545.jpg",
        description:"This is park 5"
    }, {
        name: "park 6",
        image: "https://farm6.staticflickr.com/5080/7004537596_a29365d72f.jpg",
      description:"This is park 6"    
    }
]; */

/* campgrounds.forEach(function(grounds) {
    Campground.create({
        name: grounds.name,
        url: grounds.image,
        description:grounds.description
    }, function(err, cGrounds) {
        if (err) {
            console.log(" " + err);
        }
        else {
            console.log("Campground added" + grounds.name);
        }
    });
}); */


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

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log("foundCampgrouns" + err);
        } else {
            res.render("show", {
                campground: foundCampground
            });
        }
    });
});

app.listen(3000, function () {
    console.log("yelp camp is running");
});