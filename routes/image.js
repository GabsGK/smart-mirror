const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('static'));

//Show page to capture a image from the webcam
app.get('/', (req, res) => res.sendFile('static/index.html'));

//Recive json with image as base64 encoded string.
app.use(bodyParser.json({ limit: '50mb' }));
module.exports = function initImage(app) {
    app.post('/image', (req, res) => {
        const ext = req.body.image.split(';')[0].match(/jpeg|png|gif/)[0];
        let img = req.body.image.replace(/^data:image\/png+;base64,/, "");

        img = img.replace(/ /g, '+');
        fs.writeFile('./image.png', img, 'base64', function (err) {
            console.log(err);
        });
        res.send('OK');
    });
}