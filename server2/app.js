import express from 'express';
import { createClient } from 'redis';
import { Emitter } from '@socket.io/redis-emitter';


const app = express();
const PORT = 3132;

const redisClient = createClient({ url: 'redis://host.docker.internal:6379' });
redisClient.connect().then(() => console.log('SUB REDIS CONNECTED'));
const io = new Emitter(redisClient);

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': req.headers.origin,
    });
    next();
});

app.get('/', (req, res) => {
    console.log('SUB INDEX');

    res.status(200).json({
        message: 'SUB INDEX'
    });
});

app.post('/adpater', (req, res) => {
    console.log('ADAPTER TEST');

    const { socketId, message } = req.body;
    console.log(`socketId: ${socketId}, message: ${message}`);
    console.log('server2')

    io.to(socketId).emit('StoC', { message: `${message} RECEIVED` });
});


app.listen(PORT, () => {
    console.log(`SUB RUNNING ${PORT}`);
});