/*declerations */

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.set("view engine", "ejs");

/* models include*/
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

/* passport configuration */
app.use(require("express-session")({
    secret: "Ollie Dachchund",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/*seed data*/

var seedDB = require("./seeds");


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

seedDB();

/* mongodb connection setup and check */
var uri = 'mongodb://asaraswat:temp1234@cluster0-shard-00-00-g8kxf.mongodb.net:27017,cluster0-shard-00-01-g8kxf.mongodb.net:27017,cluster0-shard-00-02-g8kxf.mongodb.net:27017/y_camp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(uri);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
    console.log("Connected");
});


/* routes */


app.get("/", function (req, res) {
    res.render("landing");
});

/*router information*/
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function () {
    console.log("yelp camp is running");
});