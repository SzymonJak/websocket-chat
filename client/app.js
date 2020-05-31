const socket = io();

const loginForm = document.getElementById('welcome-form');
const messageSection = document.getElementById('messages-section');
const messageList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('userLeft', ({ author, content }) => addMessage(author, content));

const login = function(event) {
    event.preventDefault();
    if(!userNameInput.value){
        alert('Enter username');
    } else {
        userName = userNameInput.value;
        socket.emit('join', {name: userName});
        loginForm.classList.remove('show');
        messageSection.classList.add('show');
    }
};

const addMessage = function(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName){
        message.classList.add('message--self');
    }
    if(author === 'Chat Bot'){
        message.classList.add('message--bot');
    }
    message.innerHTML = `
        <h3 class='message__author'>${userName === author ? 'You' : author}</h3>
        <div class='message__content'>${content}</div>
    `;
    messageList.appendChild(message);
};

const sendMessage = function(event) {
    event.preventDefault();

    let messageContent = messageContentInput.value;

    if(!messageContent.length) {
        alert('Nothing to be sent');
    } else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent});
        messageContentInput.value = '';
    }
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);