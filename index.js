const express = require('express');
const { getJson } = require("serpapi");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const serp_api_key = "4f5787658f22e8fa611783f9ca079bf9a1e8b91c7610aff577c8bd384aa31a4d";

let notifyResponse = [{
    job_id: 5498327,
    workspace_id: 34159,
    workspace_name: '📗 Workspace 1',
    url: 'https://rumzerincentives.wordpress.com/2024/07/01/7/',
    description: 'WordPress',
    datetime:
        'Mon Jul 22 2024 13:51:38 GMT+0000 (Coordinated Universal Time)',
    preview:
        'https://vp-files-ore.s3.us-west-2.amazonaws.com/resources/3months/2rs5BKKAbstn1NM3EPDGKLeUgOw~vPOqqYwBCcNET2MVsHYIX2KhYoA_diff.png',
    original:
        'https://s3.us-west-2.amazonaws.com/vp-files-ore/resources/3months/2rs5BKKAbstn1NM3EPDGKLeUgOw.png',
    change: '0.10189845716161505 %',
    view_changes:
        'https://visualping.io/autologin?redirect=%2Fjobs%2F5498327%3Fmode%3Dvisual',
    text_changes:
        'https://vp-files-ore.s3.us-west-2.amazonaws.com/resources/3months/2rs5BKKAbstn1NM3EPDGKLeUgOw~vPOqqYwBCcNET2MVsHYIX2KhYoA_diff.html',
    added_text: '35; 25',
    removed_text: '55; 35',
    summarizer:
        'Taxpayers will now receive a 35% deduction on state income tax for electric motor trucks, down from 55%, and a 25% reduction in property taxes for related facilities, down from 35%.',
    important: 'no analyzer call',
},]

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

app.get('/search/:state', (req, res) => {
    const state = req.params.state;

    getJson({
        engine: "google",
        api_key: serp_api_key,
        q: `Recent tax incentives for electric motors 2024 in ${state}`,
        location: `${state}`,
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
