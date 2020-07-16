const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const authController = require("../controllers/authController");
const investorController = require("../controllers/investorController");

// router
//   .route("/investor")
//   .get(investorController.getAllInvestor)
//   .post(
//     ensureAuthenticated,
//     authController.roleAuthorization(["admin"]),
//     investorController.createInvestor
//   );
router.get(
  "/investor/list/:page?/:order?/:search?/",
  ensureAuthenticated,
  authController.roleAuthorization(["admin"]),
  investorController.getAllInvestors
);

module.exports = router;
