const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

var CategorySchema = new mongoose.Schema({
    name: {type: String, 
        required: [true, "can't be blank"],
        unique : true 
    },
    parent: {
        type: String,
        required: [true, "can't be blank"], 
    },
    slug: {
        type: String,
        required: [true, "can't be blank"], 
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        defaultValue: 'Active'
    }

});

CategorySchema.path('name').validate(async (value) => {
    const nameCount = await mongoose.models.Category.countDocuments({name: value });
    return !nameCount;
  }, 'Category already exists');




//mongoose.model('User', UserSchema);
module.exports =  mongoose.model('Category', CategorySchema);
