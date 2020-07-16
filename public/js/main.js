const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userName = document.getElementById('user-name')
const roomUserList = document.getElementById('users')
const socket = io();

socket.on('message', (msgObj) => {
  outputMessage(msgObj);
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomUser', ({ room, roomUsers }) => {
  setRoomName(room);
  setRoomUsersNames(roomUsers)
})

socket.on('username', (uname) => {
  setUserName(uname)
})

// select quesry params 
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })


// Add event listener on send message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})


// Display message to the dom
const outputMessage = (msgObj) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = ` 
        <p class="meta">${msgObj.username} <span>${msgObj.time}</span></p>
        <p class="text">
        ${msgObj.text}
        </p>`;

  chatMessages.appendChild(div);
}

// Display room name
const setRoomName = (room) => {
  roomName.innerHTML = room
}

// Display room user names
const setRoomUsersNames = (users) => {
  roomUserList.innerHTML = `
  ${users.map(user => `<li> ${user.username}</li>`).join('')}`
}

const setUserName = (name) => {
  userName.innerHTML = name
}
