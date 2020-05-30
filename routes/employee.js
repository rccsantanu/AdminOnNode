const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const employeeController    = require('../controllers/employeeController');

// GET employee listing page
router.get('/employee/index', ensureAuthenticated, employeeController.index);

// GET employee create page
router.get('/employee/create', ensureAuthenticated, employeeController.create);

// POST request for employee creation
router.post('/employee/create', ensureAuthenticated, employeeController.savepost);

// GET employee edit page
router.get('/employee/edit/:id', ensureAuthenticated, employeeController.edit);

// POST request for employee edit
router.post('/employee/edit', ensureAuthenticated, employeeController.editpost);

// // delete rcategory
// router.get('/category/delete/:id', ensureAuthenticated, categoryController.delete);

module.exports = router;