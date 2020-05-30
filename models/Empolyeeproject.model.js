const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

var EmployeeprojectSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee" 
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },


});


module.exports =  mongoose.model('Employeeproject', EmployeeprojectSchema);
