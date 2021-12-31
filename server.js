const express = require("express");
var socket = require("socket.io");

const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let users = {};

// Global socket server object;
var io = socket(server);

io.sockets.on("connection", (socket) => {
  console.log("New device connected", socket.id);

  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    console.log(users);
    socket.emit("you-joined", "You have joined the chat");
    socket.broadcast.emit("user-joined", `${name} joined the chat`);
  });

  socket.on("message-sent", (message) => {
    socket.broadcast.emit(
      "message-received",
      `${users[socket.id]}: ${message}`
    );
  });
});
