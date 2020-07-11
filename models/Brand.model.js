const mongoose = require('mongoose');


var BrandSchema = new mongoose.Schema({
    brand_name: {
        type: String, 
        unique : true,
        required: [true, "can't be blank"]
    },

    status: {
        type: String,
        default: "active"
    },
},{
    timestamps:true
});


BrandSchema.path('brand_name').validate(async (value) => {
    const nameCount = await mongoose.models.Brand.countDocuments({brand_name: value });
    return !nameCount;
  }, 'Brand already exists');



//mongoose.model('User', UserSchema);
module.exports =  mongoose.model('Brand', BrandSchema);
