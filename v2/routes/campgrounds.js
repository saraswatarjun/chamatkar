var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function (req, res) {

    Campground.find({}, function (err, campgrounds) {

        if (err) {
            console.log(" campgrounds route" + err);
        } else {
            res.render("campgrounds/campgrounds", {
                camgroundsData: campgrounds,
                currentUser: req.user
            });
        }
    });


});

router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

/* post route for adding campgrounds */
router.post("/", function (req, res) {
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
            console.log("campground addition by a user: " + err);
        } else {
            res.redirect("/campgrounds");
        }
    });

});
/* route to a particular campground */


router.get("/:id", function (req, res) {

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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;