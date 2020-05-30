 const mongoose = require('mongoose');
 const Category = require('../models/Category.model');



// display category listing
exports.index = (req, res) =>{
      Category.find((err, docs) => {
            if (!err) {
                res.render("./category/index", {
                  viewTitle: "Category Listing Page",
                  messages: req.flash('message'),
                  category: JSON.parse(JSON.stringify(docs)),
                  cssClass : "hold-transition sidebar-mini layout-fixed",
                  js:"datatable"
                  });
            }
            else {
                console.log('Error in retrieving category list :' + err);
            }
      });
};


// display category page
exports.create = (req, res) =>{
      // parent category
      Category.find({parent:"/"},function(err2,maincat){
        if (err2)  throw err2;
        res.render("./category/create", {
                  viewTitle: "Category Add",
                  cssClass : "hold-transition sidebar-mini layout-fixed",
                  maincat: JSON.parse(JSON.stringify(maincat)),
                  category: req.body,
        });
      });
};

// handle category creation on POST.
exports.savepost = (req, res) =>{
    console.log("save")
    if(req.body.parent == "/"){
        cat = "/" + req.body.name;  
    }else{
        cat = "/" + req.body.parent + "/" +req.body.name;  
    }
    console.log("cat", cat);
    var category = new Category();
    category.name = req.body.name;
    category.parent = req.body.parent;
    category.slug = req.body.slug;
    category.description = req.body.description;
    category.category = cat;
    category.status = req.body.status;

    category.save((err, doc) => {
        if (!err){
            req.flash('message','saved successfully');
            res.redirect('/category/index');
        }else{
              if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("./category/create", {
                    viewTitle: "Insert Category",
                    cssClass : "hold-transition sidebar-mini layout-fixed",
                    category: req.body,
                    maincat: '',
                });
              }else{
                    console.log('Error during record insertion : ' + err);
              }
        }
   });
   
};

// edit page
exports.edit = (req, res) =>{
  Category.findById(req.params.id, (err, doc) => {
      Category.find({parent:"/"},function(err2,maincat){ 
        if (err2)  throw err2;
        if (!err) {
          res.render("category/edit", {
              viewTitle: "Update CAtegory",
              cssClass : "hold-transition sidebar-mini layout-fixed",
              category:  JSON.parse(JSON.stringify(doc)),
              maincat: JSON.parse(JSON.stringify(maincat))
          });
        }
      });
  });
}

// handle category request on POST.
exports.editpost = (req, res) =>{
  let errors = [];
  console.log("name",req.body.name)
 
  if(!req.body.name){
    errors.push({ msg: 'name can not be blank', case: 'name' });
  }
  if(!req.body.slug){
    errors.push({ msg: 'slug can not be blank', case: 'slug' });
  }
 
  if (errors.length > 0) {
    handleValidationErrorforUpdate(errors, req.body);
    res.render("category/edit", {
                      viewTitle: 'Update Employee',
                      cssClass : "hold-transition sidebar-mini layout-fixed",
                      category: req.body,
                      maincat: ''
                  });
  }else{
    Category.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) {
                  req.flash('message','updated successfully');
                  res.redirect("index");
      }
    });
  }
}

// Display book delete form on GET.
exports.delete = (req, res) =>{
  //let id = parseInt(req.params.id);
  console.log(req.params.id)
  Category.findByIdAndRemove(req.params.id, (err, doc) => {
  if (!err) {
    req.flash('message','deleted successfully');
    res.redirect("/Category/index");
    }else { 
        console.log('Error in category delete :' + err); }
    });
}

function handleValidationError(err, body) {
  //console.log("aaa",err)
  for (field in err.errors) {
      switch (err.errors[field].path) {
          case 'name':
              body['nameError'] = err.errors[field].message;
              break;
          case 'parent':
              body['parentError'] = err.errors[field].message;
              break;
          case 'slug':
              body['slugError'] = err.errors[field].message;
              break;
          default:
              break;
      }
  }
}


function handleValidationErrorforUpdate(err, body) {
  err.forEach(function(entry) {
      if(entry.case == 'name'){
        body['nameError'] = entry.msg;
      }
      if(entry.case == 'slug'){
        body['slugError'] = entry.msg;
      }
  });

}


