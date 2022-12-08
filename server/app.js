import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import fetch from 'node-fetch';


const app = express();
const PORT = 3131;

const http = createServer(app);
const io = new Server(http, { cors: { 'origin': '*' } });

const pubClient = createClient({ url: 'redis://host.docker.internal:6379' });
const subClient = pubClient.duplicate();
Promise.all([ pubClient.connect(), subClient.connect() ]).then(async() => {
    io.adapter(createAdapter(pubClient, subClient));
});
pubClient.on('connect', () => console.log('PUB ON'));
subClient.on('connect', () => console.log('SUB ON'));

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('CtoS', ({ message }) => {
        console.log(message);

        fetch('http://host.docker.internal:3132/adpater', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ socketId: socket.id, message })
        }).then((response) => {
            console.log(response.status, response.url);
        }).catch(error => console.error(error));
    });
});


app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': req.headers.origin
    });
    next();
});

app.get('/', (req, res) => {
    console.log('SERVER INDEX');

    res.status(200).json({
        message: 'SERVER INDEX'
    });
});

app.get('/api', (req, res) => {
    console.log('API INDEX');

    res.status(200).json({
        message: 'API INDEX'
    });
});

http.listen(PORT, () => {
    console.log(`SOCKET SERVER RUNNING`, http.address());
});