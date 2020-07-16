const mongoose = require("mongoose");
const User = require("../models/User.model");
const passport = require("passport");

exports.index = (req, res) => {
  // console.log(req);
  res.render("./dashboard/index", {
    viewTitle: "Dashboard Page",
    user: JSON.parse(JSON.stringify(req.user)),
    cssClass: "hold-transition sidebar-mini layout-fixed"
  });
};
