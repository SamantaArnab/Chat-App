const path = require("path");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

const  users = {}

io.on("connection", socket => {
  socket.on("new-user",name =>{
    users[socket.id] = name
    socket.broadcast.emit("user-connected", name);
  })
  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new User has joined!");
  socket.on("send-chat-message", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity not allowed!");
    }
    // io.emit("chat-message", message);
    console.log(users)
    socket.broadcast.emit("chat-message", {message: message, name: users[socket.id]})
    callback("The message was delivered!");
  });
  socket.on("sentLocation", (coords, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback("Location has been shared!");
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id]
  });
});
server.listen(port, () => {
  console.log(`chat app listening on port ${port}`);
});
