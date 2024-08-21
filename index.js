const express = require('express');
require('dotenv').config();
const { getJson } = require("serpapi");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const serp_api_key = "4f5787658f22e8fa611783f9ca079bf9a1e8b91c7610aff577c8bd384aa31a4d"

let notifyResponse = []

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send(notifyResponse ? JSON.stringify(notifyResponse) : 'No data received yet');
});

app.get('/search', (req, res) => {
    const state = req.params.state;

    getJson({
        engine: "google",
        api_key: serp_api_key,
        q: `Baoding LYSZD Trade and Business Co., Ltd. `,
        location: `United States`,
        num: "100"
    }, (json) => {
        if (json.error) {
            res.status(500).send(json.error);
            console.error(json.error);
        } else {
            res.send(json["organic_results"]);
            console.log(json["organic_results"]);
        }
    }).catch(err => {
        res.status(500).send('Error fetching data from SerpApi');
        console.error(err);
    });
});

app.post('/notify', (req, res) => {
    const data = req.body;
    console.log(`data received: ${JSON.stringify(data)}`);
    notifyResponse.push(data);
    io.emit('notification', notifyResponse);
    res.status(200).send('update emitted');
});

server.listen(port, () => {
    console.log(`Notification app listening at http://localhost:${port}`);
});
