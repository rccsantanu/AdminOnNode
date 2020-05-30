const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const projectController    = require('../controllers/projectController');

//GET category listing page
router.get('/project/index', ensureAuthenticated, projectController.index);

// GET category create page
router.get('/project/create', ensureAuthenticated, projectController.create);

// POST request for category creation
router.post('/project/create', ensureAuthenticated, projectController.savepost);

// GET category edit page
router.get('/project/edit/:id', ensureAuthenticated, projectController.edit);

// POST request for category edit
router.post('/project/edit', ensureAuthenticated, projectController.editpost);

// delete teammember from project
router.get('/project/teammembersdelete/:pid/:eid', ensureAuthenticated, projectController.teammembersdelete);

module.exports = router;