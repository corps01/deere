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
    const { job_id, workspace_name, description, datetime, change, summarizer, added_text, removed_text } = data;

    notifyResponse = `
    <p><b>Job ID:</b> ${job_id}</p>
    <p><b>Workspace Name:</b> ${workspace_name}</p>
    <p><b>Description:</b> ${description}</p>
    <p><b>Date Time:</b> ${datetime}</p>
    <p><b>Change:</b> ${change}</p>
    <p><b>Added Text:</b> ${added_text}</p>
    <p><b>Removed Text:</b> ${removed_text}</p>
    <p><b>Summary:</b> ${summarizer}</p>
    `;

    res.send(notifyResponse);
    console.log(`data received: ${notifyResponse}`)
});

app.listen(port, () => {
    console.log(`notification app listening at http://localhost:${port}`);
});
