const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/pagure/get', async (req, res) => {
    const { url } = req.body;
    const response = await fetch(url);
    if (response.ok) {
        res.send(await response.json());
    } else {
        res.send(response.statusText);
    }
});

app.post('/api/world', (req, res) => {
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/.*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
