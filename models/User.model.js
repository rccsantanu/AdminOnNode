const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    fullname: {type: String, 
        required: [true, "can't be blank"], 
    },
    email: {
        type: String,
        unique : true
    },
    password: {
        type: String,
        required: 'Password required.'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Custom validation for email
UserSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

UserSchema.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.User.countDocuments({email: value });
    return !emailCount;
  }, 'Email already exists');



// password hash
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});





//mongoose.model('User', UserSchema);
module.exports =  mongoose.model('User', UserSchema);
