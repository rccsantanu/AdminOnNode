const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var InvestorSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Firstname can't be blank"]
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ["investor"]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Email Validation
InvestorSchema.path("email").validate(val => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

// Check Email exists
InvestorSchema.path("email").validate(async value => {
  const emailCount = await mongoose.models.Investor.countDocuments({
    email: value
  });
  return !emailCount;
}, "Email already exists");

// Password Hash
InvestorSchema.pre("save", function(next) {
  var investor = this;
  // only hash the password if it has been modified (or is new)
  if (!investor.isModified("password")) return next();

  // Generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(investor.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      investor.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("Investor", InvestorSchema);
