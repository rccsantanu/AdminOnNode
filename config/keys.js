const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://basant_admin:kv5dSIA4UK51AzRp@cluster0-ipolq.mongodb.net/AdminOnNode?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  err => {
    if (err) {
      console.log("Error in db connection :" + err);
    } else {
      console.log("Mongo: Database connected successfully");
    }
  }
);
