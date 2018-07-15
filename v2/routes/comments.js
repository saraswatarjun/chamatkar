var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function (req, res) {
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
router.post("/", isLoggedIn, function (req, res) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;