const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodeAdmindb',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
},(err)=>{
    if(err){
        console.log('Error in db connection :' + err);
    }else{
        console.log("Mongo: Database connected successfully");
    }
});

