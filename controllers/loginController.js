 const mongoose = require('mongoose');
 const User = require('../models/User.model');


// display login page
exports.index = (req, res) =>{
    res.render("login", {
                viewTitle: "Login Page",
                cssClass : "hold-transition login-page"
                
              
    });
};



