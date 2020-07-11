 const mongoose = require('mongoose');
 const Employee = require('../models/Employee.model');



// employee listing
exports.index = (req, res) =>{
      Employee.find((err, docs) => {
            if (!err) {
                res.render("./employee/index", {
                  viewTitle: "Employee Listing Page",
                  messages: req.flash('message'),
                  employee: JSON.parse(JSON.stringify(docs)),
                  cssClass : "hold-transition sidebar-mini layout-fixed",
                  });
            }
            else {
                console.log('Error in retrieving employee list :' + err);
            }
      });
};

// employee create page
exports.create = (req, res) =>{
    res.render("./employee/create", {
              viewTitle: "Employee Add",
              cssClass : "hold-transition sidebar-mini layout-fixed",
              employee: req.body,
    });
};

// handle employee creation on POST.
exports.savepost = (req, res) =>{
  var employee = new Employee();
  employee.fullname = req.body.fullname;
  employee.user_type = req.body.user_type;
  employee.emp_id = req.body.emp_id;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.address = req.body.address;
  employee.status = req.body.status;

  employee.save((err, doc) => {
      if (!err){

          
          req.flash('message','saved successfully');
          res.redirect('/employee/index');
      }else{
            if (err.name == 'ValidationError') {
              handleValidationError(err, req.body);
              res.render("./employee/create", {
                  viewTitle: "Insert Employee",
                  cssClass : "hold-transition sidebar-mini layout-fixed",
                  employee: req.body
              });
            }else{
                  console.log('Error during record insertion : ' + err);
            }
      }
 });
 
};

// edit page
exports.edit = (req, res) =>{
  Employee.findById(req.params.id, (err, doc) => {
      if (!err) {
          res.render("employee/edit", {
              viewTitle: "Update Employee",
              cssClass : "hold-transition sidebar-mini layout-fixed",
              employee:  JSON.parse(JSON.stringify(doc)),
          });
        }
      });
  
}
// handle category request on POST.
exports.editpost = (req, res) =>{
  let errors = [];
  
 
  if(!req.body.fullname){
    errors.push({ msg: 'name can not be blank', case: 'fullname' });
  }
  if(!req.body.mobile){
    errors.push({ msg: 'mobile can not be blank', case: 'mobile' });
  }
 
  if (errors.length > 0) {
    handleValidationErrorforUpdate(errors, req.body);
    res.render("employee/edit", {
                      viewTitle: 'Update Employee',
                      cssClass : "hold-transition sidebar-mini layout-fixed",
                      employee: req.body
                  });
  }else{
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) {
                  req.flash('message','updated successfully');
                  res.redirect("index");
      }
    });
  }
}


function handleValidationError(err, body) {
  //console.log("aaa",err)
  for (field in err.errors) {
      switch (err.errors[field].path) {
          case 'fullname':
              body['fullnameError'] = err.errors[field].message;
              break;
          case 'mobile':
                body['mobileError'] = err.errors[field].message;
                break;
          default:
              break;
      }
  }
}

function handleValidationErrorforUpdate(err, body) {
  err.forEach(function(entry) {
      if(entry.case == 'fullname'){
        body['fullnameError'] = entry.msg;
      }
      if(entry.case == 'mobile'){
        body['mobileError'] = entry.msg;
      }
  });

}




