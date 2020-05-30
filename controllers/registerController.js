 const mongoose = require('mongoose');
 const User = require('../models/User.model');


// display register page
exports.index = (req, res) =>{
    
    res.render("register", {
                viewTitle: "Register Page",
                cssClass : "hold-transition login-page",
                messages: req.flash('message'),
                user: req.body,
              
    });
};

// handle register create on POST.
exports.create = (req, res) =>{
    insertRecord(req, res);
};

function insertRecord(req, res) {
    var user = new User();
    user.fullname = req.body.fullname;
    user.email = req.body.email;
    user.password = req.body.password;



    user.save((err, doc) => {
        if (!err){
            req.flash('message','saved successfully');
            res.redirect('/register');
        }else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("register", {
                    viewTitle: "Insert Employee",
                    user: req.body,
                    cssClass : "hold-transition login-page"
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullname':
                body['fullnameError'] = err.errors[field].message;
               break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'password':
                body['passwordError'] = err.errors[field].message;
                break;
            case 'confirm_password':
                body['confirm_passwordError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
