const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

var EmployeeSchema = new mongoose.Schema({
    fullname: {type: String, 
        required: [true, "can't be blank"], 
    },
    email: {
        type: String,
        unique : true
    },
    emp_id: {
        type: String,
        required: [true, "can't be blank"],
        unique : true
    },
    mobile: {
        type: String,
        required:[true, "can't be blank"], 
    },
    address: {
        type: String,
    },
    user_type: {
        type: String,
        required:[true, "can't be blank"], 
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        defaultValue: 'Active'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Custom validation for email
EmployeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

EmployeeSchema.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.Employee.countDocuments({email: value });
    return !emailCount;
  }, 'Email already exists');

EmployeeSchema.path('emp_id').validate(async (value) => {
    const empidCount = await mongoose.models.Employee.countDocuments({emp_id: value });
    return !empidCount;
  }, 'Emp id  already exists');


//mongoose.model('User', UserSchema);
module.exports =  mongoose.model('Employee', EmployeeSchema);
