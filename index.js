const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// POST endpoint
app.post('/notify', (req, res) => {
    const data = req.body;
    res.send(`${JSON.stringify(data)}`);
    console.log(`data received: ${JSON.stringify(data)}`)
});

app.listen(port, () => {
    console.log(`notification app listening at http://localhost:${port}`);
});
