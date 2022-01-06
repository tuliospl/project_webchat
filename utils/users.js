const { getAll } = require('../models/messages');

const users = [];
const socketsUsers = {};

const changeNickname = (socket, originalNickname, nickname) => {
  socketsUsers[socket.id] = nickname;
  const index = users.indexOf(originalNickname);
  users[index] = nickname;
  console.log(`Changed ${originalNickname} to ${nickname}`);
  return users;
};

const createUser = (socket, originalNickname) => {
  socketsUsers[socket.id] = originalNickname;
  users.push(originalNickname);
  console.log(`Created: ${originalNickname}`);
  return users;
};

const mapMessages = async () => {
  const objectMessages = await getAll();
  return objectMessages.map((object) => `${object.timestamp
  } - ${object.nickname}: ${object.message}`);
};

const removeUser = (socket) => {
  const nickname = socketsUsers[socket.id];
  const index = users.indexOf(nickname);
  users.splice(index, 1);
  console.log(`Removed: ${nickname}`);
  return users;
};

const getUsers = () => users;

module.exports = {
  changeNickname,
  createUser,
  getUsers,
  mapMessages,
  removeUser,
};