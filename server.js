const express = require("express");
const ejs = require("ejs");
var expressLayouts = require("express-ejs-layouts");
const path = require("path");
const bodyparser = require("body-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv"); // for environment variable (.env)

//// for flash messag  ////////////////
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// for .env file
dotenv.config();

dotenv.config({ path: "./config.env" });
// passport config
require("./config/passport")(passport);

// bodyparser for form
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// express session
app.use(
  session({
    secret: "santanu",
    cookie: { maxAge: 600000000000000000000000000000000000000000000000 },
    resave: false,
    saveUninitialized: false
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.error = req.flash("error");
  next();
});

// static folder for css,js
app.use("/public", express.static(path.join(__dirname, "/static588/")));

// database call
require("./config/keys");

// connection
const PORT = 3019;
app.listen(PORT, () => {
  console.log(`Express server started at port : ${PORT}`);
});

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/category"));
app.use("/", require("./routes/employee"));
app.use("/", require("./routes/project"));
app.use("/", require("./routes/brand"));
