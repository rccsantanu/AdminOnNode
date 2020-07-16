const Investor = require("../models/Investor.model");
const BaseController = require("../controllers/baseController");
const factory = require("./handleFactory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

class InvestorController extends BaseController {
  /**
   * list all investor
   * @method  Request  GET
   */
  getAllInvestors = catchAsync(async (req, res) => {
    var page = req.params.page || 1;
    // 1) Get investor data from collection
    const investors = await Investor.find();

    res.status(200).render("investor/list", {
      result: investors.length,
      current: page,
      viewTitle: "Investor Listing Page",
      user: JSON.parse(JSON.stringify(req.user)),
      search: req.query.search,
      investors,
      cssClass: "hold-transition sidebar-mini layout-fixed"
    });
  });
}
module.exports = new InvestorController();
