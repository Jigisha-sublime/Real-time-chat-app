const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formateMessage = require('./utils/messages')
const {
  joinUser,
  getCurrentUser,
  leavedUSer,
  getRoomUsers
} = require('./utils/user')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const chatboat = 'Chat Cord'

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {

  socket.on('joinRoom', ({ username, room }) => {

    const user = joinUser(socket.id, username, room)
    socket.join(user.room)
    socket.emit('username', username)
    socket.emit('message', formateMessage(chatboat, `Welcome to chat board ${username}`))
    socket.broadcast.to(user.room).emit('message', formateMessage(chatboat, `${user.username} has joined`))
    io.to(user.room).emit('roomUser', {
      room: user.room,
      roomUsers: getRoomUsers(user.room)
    })

  })

  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formateMessage(user.username, message))
  })

  socket.on('disconnect', () => {
    const user = leavedUSer(socket.id)
    if (user) {
      io.to(user.room).emit('message', formateMessage(chatboat, `${user.username} has left the room`))
      io.to(user.room).emit('roomUser', {
        room: user.room,
        roomUsers: getRoomUsers(user.room)
      })
    }

  })


})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log("server running on port :", PORT))