const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let notifyResponse = ""

app.get('/', (req, res) => {
    res.send(notifyResponse ? notifyResponse : 'No data received yet');
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// POST endpoint
app.post('/notify', (req, res) => {
    const data = req.body;
    const { job_id, workspace_name, description, datetime, change, summarizer } = data;
    notifyResponse = `Job ID: ${job_id}\nWorkspace Name: ${workspace_name}\nDescription: ${description}\nDate Time: ${datetime}\nChange: ${change}\nSummary: ${summarizer}`;
    res.send(notifyResponse);
    console.log(`data received: ${notifyResponse}`)
});

app.listen(port, () => {
    console.log(`notification app listening at http://localhost:${port}`);
});
