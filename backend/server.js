/*
server.js
Author: Derek Jeong
Description: server.js creates server with express and connect with socket.io for chatting room
*/

const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

// handling cors error: https://socket.io/docs/v3/handling-cors/
const io = require("socket.io")(server, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"],
          allowedHeaders: ["my-custom-header"],
          credentials: true,
        },
      });

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
