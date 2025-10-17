require("dotenv").config();
const app = require("./src/app")
const connectToDB = require("./src/db/db")
const http = require("http");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = http.createServer(app);
initSocketServer(httpServer)
connectToDB();

httpServer.listen(3008, ()=>{
    console.log("AI buddy is running on port 3008");
    
})