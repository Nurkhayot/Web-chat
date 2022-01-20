const app = require("./src/app");
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, console.log(`Listining ${PORT}`));
const io = require("socket.io")(server);

let onlineUsers = 0;
let users = [];
io.on("connection", (socket) => {
  //2- online userlarni soni

  onlineUsers++;

  //5-newUserJoined func ishlasin -
  socket.on("newUser", (newUser) => {
    users.push({ name: newUser, id: socket.id });
    socket.broadcast.emit("newUserJoined", { newUser });

    //
    io.sockets.emit("printNumOnUsers", {
      onlineUsers: onlineUsers,
      users: users,
    });
  });

  //8-Yangi habar kelsa frontdagi printMessage funct ishlasin. - habarni yetkaziz uchun
  socket.on("newMessage", (data) => {
    // io.sockets.emit("printMessage", data);
    const fUser = users.find((user) => user.name == data.to);
    if (fUser) {
      socket.broadcast.to(fUser.id).emit("printMessage", data);
      socket.emit("printMessageYou", data);
    } else {
      socket.emit("ErrorUser", "Bunday user yo'q");
    }
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    const upUsers = users.filter((user) => user.id != socket.id);
    users = upUsers;
    io.sockets.emit("printNumOnUsers", {
      onlineUsers: onlineUsers,
      users: users,
    });
  });
});
