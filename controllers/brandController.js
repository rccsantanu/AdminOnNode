const Brand = require("../models/Brand.model");
const BaseController = require("./baseController");
const AppError = require("./../utils/appError");

class BrandController extends BaseController {
  /**
   * list all brand
   * @method  Request  GET
   */
  list = async (req, res, next) => {
    // sort order
    if (req.params.order == "asc_name") {
      var setOrder = "asc_name";
      var sortorder = {
        brand_name: 1
      };
    } else if (req.params.order == "desc_name") {
      var setOrder = "desc_name";
      var sortorder = {
        brand_name: -1
      };
    }
    if (req.params.order == "asc_status") {
      var setOrder = "asc_status";
      var sortorder = {
        status: 1
      };
    } else if (req.params.order == "desc_status") {
      var setOrder = "desc_status";
      var sortorder = {
        status: -1
      };
    } else {
      var setOrder = "desc_id";
      var sortorder = {
        _id: -1
      };
    }
    // end of sorting

    // search query
    var queryCount = Object.keys(req.query).length;
    var searchQuery = {};
    if (queryCount >= 1) {
      searchQuery = {
        $or: [
          { status: { $regex: req.query.search, $options: "i" } },
          { brand_name: { $regex: req.query.search, $options: "i" } }
        ]
      };
    }
    // end of search query

    // main query with pagination
    var perPage = 8;
    var page = req.params.page || 1;

    await Brand.find(searchQuery)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort(sortorder)
      .exec(function(err, docs) {
        Brand.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("brand/list", {
            brand: docs,
            current: page,
            pages: Math.ceil(count / perPage),
            search: req.query.search,
            user: JSON.parse(JSON.stringify(req.user)),
            setOrder: setOrder,
            cssClass: "hold-transition sidebar-mini layout-fixed",
            messages: req.flash("message"),
            viewTitle: "Brand Listing Page"
          });
        });
      });
  };

  /**
   * view - brand creation page
   * @method  Request  GET
   */
  create = (req, res) => {
    console.log(res);
    res.render("./brand/create", {
      viewTitle: "Brand Add",
      user: JSON.parse(JSON.stringify(req.user)),
      cssClass: "hold-transition sidebar-mini layout-fixed",
      brand: req.body
    });
  };

  /**
   * brand creation , save to database
   * @method  Request  POST
   */

  savepost = async (req, res, next) => {
    var brand = await new Brand();
    brand.brand_name = req.body.brand_name.trim();

    const savedBrand = await brand.save((err, doc) => {
      if (!err) {
        req.flash("message", "saved successfully");
        res.redirect("/brand/list");
      } else {
        if (err.name == "ValidationError") {
          this.handleValidationError(err, req.body);
          res.render("./brand/create", {
            viewTitle: "Brand Create",
            cssClass: "hold-transition sidebar-mini layout-fixed",
            brand: req.body
          });
        } else {
          console.log("Error during record insertion : " + err);
        }
      }
    });
  };

  /**
   * view - brand edit page
   * @method  Request  GET
   */

  edit = async (req, res) => {
    await Brand.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render("brand/edit", {
          viewTitle: "Update Brand",
          cssClass: "hold-transition sidebar-mini layout-fixed",
          brand: JSON.parse(JSON.stringify(doc)),
          messages: req.flash("message")
        });
      }
    });
  };

  /**
   * view - brand edit page
   * @method  Request  GET
   */
  editpost = async (req, res, next) => {
    await Brand.findById(req.body._id, (uniqueError, uniquedoc) => {
      if (uniqueError) throw uniqueError;
      else {
        if (uniquedoc.brand_name === req.body.brand_name.trim()) {
          var _update = {
            status: req.body.status
          };
        } else {
          var _update = {
            brand_name: req.body.brand_name,
            status: req.body.status
          };
        }
        this.doupdate(req, res, next, _update);
      }
    });
  };

  /**
   * view - brand edit page
   * @function  for maintaing nested async for update
   */
  doupdate = async (req, res, next, _update) => {
    await Brand.findByIdAndUpdate(
      req.body._id,
      { $set: _update },
      { new: true, runValidators: true },
      function(err, doc) {
        if (!err) {
          req.flash("message", "saved successfully");
          res.redirect("/brand/list");
        } else {
          if (err.name == "ValidationError") {
            let field;
            let body = [];
            for (field in err.errors) {
              switch (err.errors[field].path) {
                case "brand_name":
                  req.body["brand_nameError"] = err.errors[field].message;
                  break;
                default:
                  break;
              }
            }

            res.render("./brand/edit", {
              viewTitle: "Brand edit",
              cssClass: "hold-transition sidebar-mini layout-fixed",
              brand: req.body
            });
          } else {
            console.log("Error during record insertion : " + err);
          }
        }
      }
    );
  };

  search = async (req, res, next) => {
    console.log("search1", req.body.search);
    var searchQuery = {};
    //searchQuery.email = req.query.email;
    searchQuery.brand_name = { $regex: req.body.search, $options: "i" };
    // await Brand.find( searchQuery, (err, docs) => {
    //     if (!err) {
    //         // res.render("./brand/list", {
    //         //         viewTitle: "Brand Listing Page",
    //         //         messages: req.flash('message'),
    //         //         brand: JSON.parse(JSON.stringify(docs)),
    //         //         cssClass : "hold-transition sidebar-mini layout-fixed",
    //         // });
    //         res.redirect('/brand/list/'+ JSON.parse(JSON.stringify(docs)));
    //       }

    res.redirect("/brand/list/" + searchQuery);

    // });
  };

  handleValidationError(err, body) {
    let field;
    for (field in err.errors) {
      switch (err.errors[field].path) {
        case "brand_name":
          body["brand_nameError"] = err.errors[field].message;
          break;

        default:
          break;
      }
    }
  }
  deleteBrand = async (req, res, next) => {
    const doc = await Brand.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null
    });
  };
}

module.exports = new BrandController();
