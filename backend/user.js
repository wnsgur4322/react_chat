let users = [];

exports.createUser = ({ id, username, room }) => {
        if (!username || !room){
                return {error: "username and room required"};
        }
        const user = { id, username, room };
        users.push(user);

        return { user };
};

exports.getCurrentUser = (id) => {
        return users.find((user) => user.id === id);
};

exports.removeUser = (id) => {
        const i = users.findIndex((user) => user.id === id);
        return users[i];
};

exports.getRoomUsers = (room) => {
        return users.filter((user) => user.room === room);
}