const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const categoryController    = require('../controllers/categoryController');

// GET category listing page
router.get('/category/index', ensureAuthenticated, categoryController.index);

// GET category create page
router.get('/category/create', ensureAuthenticated, categoryController.create);

// POST request for category creation
router.post('/category/create', ensureAuthenticated, categoryController.savepost);

// GET category edit page
router.get('/category/edit/:id', ensureAuthenticated, categoryController.edit);

// POST request for category edit
router.post('/category/edit', ensureAuthenticated, categoryController.editpost);

// delete rcategory
router.get('/category/delete/:id', ensureAuthenticated, categoryController.delete);

module.exports = router;