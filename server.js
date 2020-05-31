const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = []; //logs all messages sent by users
const users = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
});

app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
    res.status(404).send('404 not found...');
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running port:8000');
});
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('join', (user) => {
        console.log(user.name + ' is logged in');
        user.id = socket.id;
        users.push(user);
        console.log(users);
        socket.broadcast.emit('message', { author: 'Chat Bot', content: `${user.name} has joined the conversation!` });
    });
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        const removeUser = users.findIndex(user => {
            return user.id == socket.id;
        });
        socket.broadcast.emit('userLeft', { author: 'Chat Bot', content: `${users[removeUser].name} has left conversation... ;(`});
        users.splice(removeUser, 1);
        console.log(users);
    });
    console.log('I\'ve added a listener on message event \n');
  });