const mongoose = require("mongoose")


const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to db");
        
    }).catch((err)=>{
        console.log("Error connecting db", err);
        
    })
}
module.exports = connectToDB;