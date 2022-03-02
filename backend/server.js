const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
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
const {createUser, getCurrentUser, removeUser, getRoomUsers, deleteData} = require('./user');

io.on("connection", (socket) => {
        // join chat room and messaging by createUser
        console.log('A Connection has been made');
        socket.on("join", ({ username, room }, callback) => {
                const {user, error} = createUser({ id: socket.id, username, room });

                if (error) return callback(error);

                socket.join(user.room);
                socket.emit("message", {
                        user: "Admin",
                        text: `Welcome to ${user.room} !!`,
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
                const user = removeUser(socket.id);
                console.log(user);

                io.to(user.room).emit("message", {
                  user: "Admin",
                  text: `${user.username} just left the room`,
                });

                console.log(`${user.username} has disconnected!!`);
                deleteData(socket.id);
        });
});

// connect with server port 3080
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));