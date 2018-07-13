var mongoose = require("mongoose");
var  Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [{
        name: "park 1",
        image: "https://farm2.staticflickr.com/1227/925559735_5f2350b690.jpg",
        description: "This is park 1"
    },
    {
        name: "park 2",
        image: "https://farm4.staticflickr.com/3474/3907198073_2918b28097.jpg",
        description: "This is park 2"
    },
    {
        name: "park 3",
        image: "https://farm9.staticflickr.com/8035/7930442194_40e37f5ea0.jpg",
        description: "This is park 3"
    },
    {
        name: "park 4",
        image: "https://farm6.staticflickr.com/5080/7004537596_a29365d72f.jpg",
        description: "This is park 4"
    },
    {
        name: "park 5",
        image: "https://farm4.staticflickr.com/3457/3871440451_181099e545.jpg",
        description: "This is park 9"
    }, {
        name: "park 6",
        image: "https://farm6.staticflickr.com/5080/7004537596_a29365d72f.jpg",
        description: "This is park 6"
    }
];

/* adding campgrounds */
function seedAdd() {
    data.forEach(function (grounds) {
        Campground.create({
            name: grounds.name,
            url: grounds.image,
            description: grounds.description
        }, function (err, cGrounds) {
            if (err) {
                console.log("bad shit " + err);
            } else {
                console.log("\n Campground added " + grounds.name);
                Comment.create({
                    text: "Adding a comment here and there",
                    author: "Ollie"
                }, function (err, comment) {
                    if (err) {
                        console.log("something bad happened");
                    } else {
                        cGrounds.comments.push(comment);
                        cGrounds.save();
                        console.log("comment addded");
                    }
                });
            }
        });
    });
}

/* removing campgrounds */
function seedDB() {
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("remove campground");
            seedAdd();
        }
    });
}

/* adding comments */

module.exports = seedDB;