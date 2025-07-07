// jshint version:6

const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const { Server } = require('socket.io');

const messages = [];

const app = express();
const server = http.createServer(app); // Use this server for both express and socket.io
const io = new Server(server);         // Attach socket.io to the HTTP server

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serve public folder correctly

app.get("/", function (req, res) {
  res.render("auth");
});

app.get("/index", function(req, res){
    const nickname = req.query.nickname || "Anonymous";
    res.render("index", { nickname });
});


// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected');

  // ✅ Send chat history to the newly connected client
  socket.emit('chat history', messages);

  // ✅ Receive new message
  socket.on('chat message', (data) => {
    // Save to memory
    messages.push(data);

    // Broadcast to everyone
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// ✅ USE server.listen NOT app.listen
server.listen(3000, function () {
  console.log("Server is running on port 3000");
});
