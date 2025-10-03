require("dotenv").config();
const app = require("./src/app")
const connectToDB = require("./src/db/db")

connectToDB();


app.listen(3003, ()=>{
    console.log("order service is running at port 3003");
    
})