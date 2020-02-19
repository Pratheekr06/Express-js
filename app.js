var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash =require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds.js");

//Require Routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://webdev:dreammate@cluster0-o2dmj.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser : true , useUnifiedTopology: true , useFindAndModify : false , useCreateIndex: true});
app.use(bodyParser.urlencoded({extended : true})); 
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
	secret : "johnny depp is the best actor in the world",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Using Routes
app.use(indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);


app.listen(process.env.PORT || 3000 , process.env.IP , function(){
	console.log("YelpCamp Server has started");
});