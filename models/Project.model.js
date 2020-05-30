const mongoose = require('mongoose');


var ProjectSchema = new mongoose.Schema({
    project_name: {
        type: String, 
        required: [true, "can't be blank"]
    },
    project_description: {
        type: String, 
        required: [true, "can't be blank"]
    },
    status: {
        type: String
    },
    client_company: {
        type: String, 
        required: [true, "can't be blank"]
    },
    project_notes: {
        type: String
    },
    estimated_budget: {
        type: String, 
        required: [true, "can't be blank"]
    },
    amount_spent: {
        type: String
    },
    project_duration: {
        type: String, 
        required: [true, "can't be blank"]
    },
    teammember: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee"
        }
      ]
},{
    timestamps:true
});





//mongoose.model('User', UserSchema);
module.exports =  mongoose.model('Project', ProjectSchema);
