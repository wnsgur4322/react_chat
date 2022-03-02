/*
server.js
Author: Derek Jeong
Description: server.js creates a server with express and connect with socket.io for chatting room
*/

const http = require("http");
const express = require("express");
const cors = require('cors');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// handling cors error: https://socket.io/docs/v3/handling-cors/
// const io = require("socket.io")(server, {
//         cors: {
//           origin: "https://621fcff94b7fa16d3dc32d81--kimchichat.netlify.app/",
//           methods: ["GET", "POST"],
//           allowedHeaders: ["my-custom-header"],
//           credentials: true,
//         },
//       });
const io = socketio(server);
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.use(cors());

const PORT = process.env.PORT || 3080

// import create user function and message
const {createUser, getCurrentUser, deleteUser, getRoomUsers} = require('./user');

io.on("connection", (socket) => {
        // join chat room and messaging by createUser
        console.log('A Connection has been made');
        socket.on("join", ({ username, room }, callback) => {
                const {user, error} = createUser({ id: socket.id, username, room });

                if (error) return callback(error);

                socket.join(user.room);
                socket.emit("message", {
                        user: "Admin",
                        text: `Welcome to ${user.room} chatroom!!`,
                });
            
                socket.broadcast
                        .to(user.room)
                        .emit("message", { user: "Admin", text: `${user.username} has joined!` });
                io.to(user.room).emit("roomData", {
                        room: user.room,
                        users: getRoomUsers(user.room)
                });
                callback(null);
        });

        //send message
        socket.on("sendMessage", (message) => {
                const user = getCurrentUser(socket.id);
            
                io.to(user.room).emit("message", {
                        user: user.username,
                        text: message,
                });
        });

        // user disconection
        socket.on("disconnect", () => {
                const user = deleteUser(socket.id);
                console.log(user);
                console.log(`${user.username} has disconnected!!`);
                if(user){
                        io.to(user.room).emit("message", {
                                user: "Admin",
                                text: `${user.username} just left the room`,
                        });
                        io.to(user.room).emit("roomData", {
                                room: user.room,
                                users: getRoomUsers(user.room)
                        });
                }
        });
});

// connect with server port 3080
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
