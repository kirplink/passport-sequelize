var express = require("express");
var passport = require("passport");
var session = require("express-session");
var exphbs = require("express-handlebars");

var db = require("./app/models");

var app = express();
var PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//for passport
app.use(
	session({
		secret: "anything you want",
		resave: true,
		saveUninitialized: true
	})
); //session secret
app.use(passport.initialize());
app.use(passport.session()); //allows persistent login sessions

//set up handlebars
app.set("views", "./app/views");
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.get("/", function(req, res) {
	res.send("Welcome to Passport with Sequlize");
});

//routes
require("./app/routes/auth.js")(app, passport);

//passport init
require("./app/config/passport/passport.js")(passport, db.User);

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("App listening on http://localhost:" + PORT);
	});
});
