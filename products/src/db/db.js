const mongoose = require("mongoose")


const connectToDB = () => {
    try{
        mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database Connected");
        
    }).catch(err => {
        console.log("Error connecting db", err);
        
    })
    }catch(err){
        console.log("error", err);
        
    }
}

module.exports = connectToDB;