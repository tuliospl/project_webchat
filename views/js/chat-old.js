const socket = window.io();

window.onbeforeunload = () => {
  socket.disconnect();
};

const makeId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

let nickname = makeId(16);
let originalNickname = nickname;
const online = 'online-user';
const users = document.getElementById('users');
const userForm = document.getElementById('users-form');
const userInput = document.getElementById('user-input');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Cria o usuário atual na lista
const user = document.createElement('li');
user.textContent = nickname;
user.dataset.testid = online;

// https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-the-first-child
window.onload = () => {
  console.log('Onload');
  if (users.firstChild) {
    users.insertBefore(user, users.firstChild);
  } else {
    users.appendChild(user);
  }
  socket.emit('createUser', { originalNickname: nickname, nickname });
};

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (userInput.value) {
    originalNickname = nickname;
    nickname = userInput.value;
    socket.emit('changeNickname', { originalNickname, nickname });
    userInput.value = '';
  }
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit('message', { chatMessage: messageInput.value, nickname });
    messageInput.value = '';
  }
});

socket.on('message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  item.dataset.testid = 'message';
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('changeNickname', (usernames) => {
  console.log(usernames);
  users.textContent = '';
  const currentUser = document.createElement('li');
  currentUser.textContent = nickname;
  currentUser.dataset.testid = online;
  users.appendChild(currentUser);
  usernames.forEach((element) => {
    const item = document.createElement('li');
    item.textContent = element;
    item.dataset.testid = online;
    if (element !== nickname) users.appendChild(item);
  });
}); 