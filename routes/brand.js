const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const brandController = require("../controllers/brandController");

// GET request for brand listing page
router.get(
  "/brand/list/:page?/:order?/:search?/",
  ensureAuthenticated,
  brandController.list
);

// GET request for brand createtion page
router.get("/brand/create", ensureAuthenticated, brandController.create);

// POST request for brand creation
router.post("/brand/create", ensureAuthenticated, brandController.savepost);

// GET request for brand edit page
router.get("/brand/edit/:id", ensureAuthenticated, brandController.edit);

// POST request for brand edit
router.post("/brand/edit", ensureAuthenticated, brandController.editpost);

router.delete(
  "/brand/delete/:id",
  ensureAuthenticated,
  brandController.deleteBrand
);

// GET request for brand search
router.post("/brand/search", ensureAuthenticated, brandController.search);

module.exports = router;
