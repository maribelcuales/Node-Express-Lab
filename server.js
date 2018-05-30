import { read } from 'fs';

// import your node modules
const express = require('express'); 
const cors = require('cors');  
const db = require('./data/db.js');

// add your server code starting here
const port = 5000; 
const server = express(); 
server.use(express.json()); 
server.use(cors({ origin: 'http://localhost:3000 '})); 

const sendUserError = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return; 
}; 

const customLogger = (req, res, next) => {
    const ua = req.headers['user-agent'];
    console.log(req.headers); 
    const { path } = req;
    const timeStamp = Date.now();
    const log = { path, ua, timeStamp };
    const stringLog = JSON.stringify(log);
    console.log(stringLog);
    next();
}; 

server.use(customLogger); 

server.get('/', (req, res) => {
    res.send('Test Post'); 
}); 

server.post('/api/posts', (req, res) => {
    const { title, contents } = req.body;  
    if (!title || !contents) {
        sendUserError(400, "Please provide title and contents for the post.", res);
        return; 
    }
    db 
        .insert({ title, contents })
        .then(response => {
            res.status(201).json(response); 
        })
        .catch(error => {
            console.log(error); 
            sendUserError(500, "There was an error while saving the post to the database", res);
            return; 
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));

