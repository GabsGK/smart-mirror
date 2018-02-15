const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const watson = require('watson-developer-cloud');
const intoStream = require('into-stream')
const base64 = require('base64-stream');
var async = require('async');
var extend = require('extend');
var uuid = require('uuid');
var os = require('os');

module.exports = function initImage(app) {
  var visual_recognition = watson.visual_recognition({
    api_key: '67461890dc1f2c6cb7e85fe6e9836dd64c1e5fdf',
    version: 'v3',
    version_date: '2016-05-20'
  });

  let parameters = {
    //classifier_ids: ["Participants","Face Detection"],
    classifier_ids: ["Face Detection", "Participants_1283125451"],
    threshold: 1.0
  };

  //Show page to capture a image from the webcam
  app.get('/', (req, res) => res.sendFile('ui/index.html'));

  //Recive json with image as base64 encoded string.
  app.use(bodyParser.json({ limit: '50mb' }));
  app.post('/image', (req, res) => {
    let img = req.body.image.replace(/^data:image\/png+;base64,/, "").replace(/ /g, '+');

    fs.writeFile('./image.png', img, 'base64', function (err) {
      var params = {
        images_file: fs.createReadStream('./image.png'),
        parameters
      };

      var methods = [];

      methods.push('classify');
      methods.push('detectFaces');

      function deleteUploadedFile(readStream) {
        fs.unlink(readStream.path, function(e) {
          if (e) {
            console.log('error deleting %s: %s', readStream.path, e);
          }
        });
      }

      // run the classifiers asynchronously and combine the results
      async.parallel(methods.map(function (method) {
        var fn = visual_recognition[method].bind(visual_recognition, params);
        if (method === 'detectFaces') {
          return async.reflect(async.timeout(fn, 10000));
        } else {
          return async.reflect(fn);
        }
      }), function (err, results) {
        // delete the recognized file
        if (params.images_file && !req.body.url) {
          deleteUploadedFile(params.images_file);
        }

        if (err) {
          console.log(err);
          return res.status(err.code || 500).json(err);
        }
        // combine the results
        var combine = results.map(function (result) {
          if (result.value && result.value.length) {
            // value is an array of arguments passed to the callback (excluding the error).
            // In this case, it's the result and then the request object.
            // We only want the result.
            result.value = result.value[0];
          }
          return result;
        }).reduce(function (prev, cur) {
          return extend(true, prev, cur);
        });
        if (combine.value) {
          // save the classifier_id as part of the response
          if (req.body.classifier_id) {
            combine.value.classifier_ids = req.body.classifier_id;
          }
          combine.value.raw = {};
          methods.map(function (methodName, idx) {
            combine.value.raw[methodName] = encodeURIComponent(JSON.stringify(results[idx].value));
          });
          res.json(combine.value);
          //res.send(JSON.stringify(combine.value, null, 2))
        } else {
          res.status(400).json(combine.error);
        }
      });
    });
  });
}