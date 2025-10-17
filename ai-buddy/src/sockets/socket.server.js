const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const cookie = require("cookie");


async function initSocketServer(httpServer){
    const io = new Server(httpServer, {})

    io.on("connection", (socket)=>{
        console.log("a user connected");
        
    })
}

module.exports = initSocketServer;