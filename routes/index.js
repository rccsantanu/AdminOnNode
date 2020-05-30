const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const registerController = require('../controllers/registerController');
const loginController    = require('../controllers/loginController');
const dashboardController    = require('../controllers/dashboardController');

// GET Login page
router.get('/', loginController.index);
router.get('/login', loginController.index);
// POST request for login.
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard/index',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
  

// GET register page
router.get('/register', registerController.index);
// POST register page
router.post('/register', registerController.create);

// GET dashboard page
router.get('/dashboard/index', ensureAuthenticated, dashboardController.index);

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });



// router.get('/dashboard/index/', ensureAuthenticated, (req, res) =>{
//     console.log("ppp",req.user);
//     res.render('dashboard/index', {
    
//     user: JSON.parse(JSON.stringify(req.user))
//   })
// });


module.exports = router;