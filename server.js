const express = require('express');
const path = require('path');

const app = express();

const messages = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
});

app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
    res.status(404).send('404 not found...');
});

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running port:8000');
});