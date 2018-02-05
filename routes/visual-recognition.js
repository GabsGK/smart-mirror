const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const watson = require('watson-developer-cloud');
const intoStream = require('into-stream')
const base64 = require('base64-stream');


module.exports = function initImage(app) {
    //Show page to capture a image from the webcam
    app.get('/', (req, res) => res.sendFile('ui/index.html'));

    //Recive json with image as base64 encoded string.
    app.use(bodyParser.json({ limit: '50mb' }));
    app.post('/image', (req, res) => {
        let img = req.body.image.replace(/^data:image\/png+;base64,/, "").replace(/ /g, '+');
      
        var visual_recognition = watson.visual_recognition({
          api_key: '67461890dc1f2c6cb7e85fe6e9836dd64c1e5fdf',
          version: 'v3',
          version_date: '2016-05-20'
        });
      
        fs.writeFile('./image.png', img, 'base64', function(err) {
          var params = {
            images_file: fs.createReadStream('./image.png')
          };
      
          visual_recognition.detectFaces(params, function(err, response) {
            if (err) console.log(err);
            else res.send(JSON.stringify(response, null, 2))
          });
        });
      });
}