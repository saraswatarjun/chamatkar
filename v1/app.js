var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");


var campgrounds = [{
        name: "park 1",
        image: "https://farm2.staticflickr.com/1227/925559735_5f2350b690.jpg"
    },
    {
        name: "park 2",
        image: "https://farm4.staticflickr.com/3474/3907198073_2918b28097.jpg"
    },
    {
        name: "park 3",
        image: "https://farm9.staticflickr.com/8035/7930442194_40e37f5ea0.jpg"
    },
    {
        name: "park 4",
        image: "https://farm6.staticflickr.com/5080/7004537596_a29365d72f.jpg"
    },
    {
        name: "park 5",
        image: "https://farm4.staticflickr.com/3457/3871440451_181099e545.jpg"
    }, {
        name: "park 6",
        image: "https://farm6.staticflickr.com/5080/7004537596_a29365d72f.jpg"
    }
];


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {

    res.render("campgrounds", {
        camgroundsData: campgrounds
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

/* post route for adding campgrounds */
app.post("/campgrounds", function (req, res) {
    var newCampground = {
        name: req.body.name,
        image: req.body.image
    };
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.listen(3000, function () {
    console.log("Server started...");
});