 const mongoose = require('mongoose');
 const Project = require('../models/Project.model');
 const Employee = require('../models/Employee.model');
 const Employeeproject = require('../models/Empolyeeproject.model');
 
// display category listing
exports.index = (req, res) =>{
    //Project.find((err, docs) => {
    Project.find({}).populate("teammember").exec((err, docs) => {
            if (!err) {
                res.render("./project/index", {
                viewTitle: "Project Listing Page",
                messages: req.flash('message'),
                project: JSON.parse(JSON.stringify(docs)),
                cssClass : "hold-transition sidebar-mini layout-fixed",
                });
            }else {
               console.log('Error in retrieving category list :' + err);
            }
    });
};

// display category page
exports.create = (req, res) =>{
    Employee.find((err, docs) => {
      if (!err) {
          res.render("./project/create", {
          viewTitle: "Project Add",
          cssClass : "hold-transition sidebar-mini layout-fixed",
          project: req.body,
          employee: JSON.parse(JSON.stringify(docs))
          });
      }else{
        console.log('Error in retrieving employee list :' + err);
      }
       
      });
     
};

// handle category creation on POST.
exports.savepost = (req, res) =>{
    var project = new Project();
    project.project_name = req.body.project_name;
    project.project_description = req.body.project_description;
    project.status = req.body.status;
    project.client_company = req.body.client_company;
    project.project_notes = req.body.project_notes;
    project.estimated_budget = req.body.estimated_budget;
    project.amount_spent = req.body.amount_spent;
    project.project_duration = req.body.project_duration;
    project.teammember = req.body.teammember;
    
    project.save((err, doc) => {
       if (!err){
        req.body.teammember.forEach(function(team) {
            var employeeproject = new Employeeproject();
            employeeproject.employee_id = team;
            employeeproject.project_id = project._id;
            employeeproject.save();
        });
            req.flash('message','saved successfully');
            res.redirect('/project/index');
       }else{
            if (err.name == 'ValidationError') {
              Employee.find((err, docs) => {
                  handleValidationError(err, req.body);
                  res.render("./project/create", {
                      viewTitle: "Project Category",
                      cssClass : "hold-transition sidebar-mini layout-fixed",
                      project: req.body,
                      employee: JSON.parse(JSON.stringify(docs)),
                  });
              });
            }else{
                  console.log('Error during record insertion : ' + err);
            }
       }
  });
}

// edit page
exports.edit = (req, res) =>{
    //Project.findById(req.params.id, (err, doc) => {
    Project.findById(req.params.id).populate("teammember").exec((err, doc) => {
        Employee.find((err2, employee) => {
          if (err2)  throw err2;
          if (!err) {
            res.render("project/edit", {
                viewTitle: "Update CAtegory",
                cssClass : "hold-transition sidebar-mini layout-fixed",
                project:  JSON.parse(JSON.stringify(doc)),
                project1: '',
                employee: JSON.parse(JSON.stringify(employee)),
                messages: req.flash('message'),
            });
          }
        });
    });
}

// handle category request on POST.
exports.editpost = (req, res) =>{
    let errors = [];
    
   
    if(!req.body.project_name){
      errors.push({ msg: 'project name can not be blank', case: 'project_name' });
    }
    if(!req.body.project_description){
      errors.push({ msg: 'description can not be blank', case: 'project_description' });
    }
    if(!req.body.client_company){
        errors.push({ msg: 'can not be blank', case: 'client_company' });
    }
    if(!req.body.estimated_budget){
        errors.push({ msg: 'can not be blank', case: 'estimated_budget' });
    }
    if(!req.body.project_duration){
        errors.push({ msg: 'can not be blank', case: 'project_duration' });
    }
   
    if (errors.length > 0) {
      handleValidationErrorforUpdate(errors, req.body);
      Project.findById(req.body._id).populate("teammember").exec((err, doc) => {
      Employee.find((err2, employee) => {
      res.render("project/edit", {
                        viewTitle: 'Update Project',
                        cssClass : "hold-transition sidebar-mini layout-fixed",
                        project: req.body,
                        project1:  JSON.parse(JSON.stringify(doc)),
                        employee: JSON.parse(JSON.stringify(employee)),
                    });
      });
    });
    }else{
        if(typeof req.body.teammember != 'undefined' &&  req.body.teammember !=''){
            Project.findByIdAndUpdate(req.body._id, 
                {$push: {teammember:  req.body.teammember},
                        project_name: req.body.project_name,
                        project_description: req.body.project_description,
                        status: req.body.status,
                        status: req.body.status,
                        client_company: req.body.client_company,
                        project_notes: req.body.project_notes,
                        estimated_budget: req.body.estimated_budget,
                        amount_spent: req.body.amount_spent,
                        project_duration: req.body.project_duration,
                        }, 
                        {safe: true, upsert: true},function(errblock3, doc) {
                                if(errblock3){
                                    console.log("error block 3",errblock3 );
                                }else{
                                    req.flash('message','updated successfully');
                                    res.redirect('/project/index');
                                }
                        }
            );

            req.body.teammember.forEach(function(team) {
                var employeeproject = new Employeeproject();
                employeeproject.employee_id = team;
                employeeproject.project_id = req.body._id;
                employeeproject.save();
            });
       }else{
            Project.findByIdAndUpdate(req.body._id, 
                { project_name: req.body.project_name ,
                project_description: req.body.project_description,
                status: req.body.status,
                status: req.body.status,
                client_company: req.body.client_company,
                project_notes: req.body.project_notes,
                estimated_budget: req.body.estimated_budget,
                amount_spent: req.body.amount_spent,
                project_duration: req.body.project_duration,
                },
                {safe: true, upsert: true}, function(errblock4, doc) {
                    if(errblock4){
                        console.log("error block 3",errblock3 );
                    }else{
                        req.flash('message','updated successfully');
                        res.redirect('/project/index');
                    }
                }
            );

       }
      
    }
}

// Display book delete form on GET.
exports.teammembersdelete = (req, res) =>{
    console.log("d1",req.params.eid)
  
     var myquery = { employee_id: req.params.eid , project_id: req.params.pid};
     Employeeproject.deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
       
      });



    Project.update({_id:req.params.pid}, {$pull:{"teammember": req.params.eid }}, function(errfordelete){
       
        if(errfordelete){
            console.log('Error during record insertion : ' + errfordelete);
        }else{
            req.flash('message','removed successfully');
            res.redirect('/project/edit/'+req.params.pid);
        }
    });
   
   
  }

function handleValidationError(err, body) {
  //console.log("aaa",err)
  for (field in err.errors) {
      switch (err.errors[field].path) {
          case 'project_name':
              body['project_nameError'] = err.errors[field].message;
              break;
          case 'project_description':
              body['project_descriptionError'] = err.errors[field].message;
              break;
          case 'client_company':
              body['client_companyError'] = err.errors[field].message;
              break;
          case 'estimated_budget':
                body['estimated_budgetError'] = err.errors[field].message;
                break;
          case 'project_duration':
              body['project_durationError'] = err.errors[field].message;
              break;
          default:
              break;
      }
  }
}

function handleValidationErrorforUpdate(err, body) {
    err.forEach(function(entry) {
        if(entry.case == 'project_name'){
          body['project_nameError'] = entry.msg;
        }
        if(entry.case == 'project_description'){
          body['project_descriptionError'] = entry.msg;
        }
        if(entry.case == 'client_company'){
            body['client_companyError'] = entry.msg;
        }
        if(entry.case == 'estimated_budget'){
            body['estimated_budgetError'] = entry.msg;
        }
        if(entry.case == 'project_duration'){
            body['project_durationError'] = entry.msg;
        }
    });
  
}




