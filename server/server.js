const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var {generateMessage} = require('./utils/message');


const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newMessage',  {
  //   from: 'John',
  //   text: 'Hi Mike!',
  //   createAt: 123
  // });
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    callback('This is from the server');
  });

  socket.on('disconnect', (socket) => {
    console.log('User disconnected');
  });

});

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
