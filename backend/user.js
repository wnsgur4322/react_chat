/*
user.js
Author: Derek Jeong
Description: user.js provides functions for user data handling
*/

let users = [];

// create user
exports.createUser = ({ id, username, room }) => {
        if (!username || !room){
                return {error: "username and room required"};
        }
        const user = { id, username, room };
        users.push(user);

        return { user };
};

// get current user in the room with user id
exports.getCurrentUser = (id) => {
        return users.find((user) => user.id === id);
};

// remove
exports.removeUser = (id) => {
        const i = users.findIndex((user) => user.id === id);
        return users[i];
};

// delete user when disconnect has called
exports.deleteUser = (id) => {
        const i = users.findIndex((user) => user.id === id);
        if(i !== -1){
                return users.splice(i, 1)[0];
        }
}

// get user list in the room
exports.getRoomUsers = (room) => {
        return users.filter((user) => user.room === room);
}