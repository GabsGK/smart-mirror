/*
 * Copyright © 2018. All rights reserved.
 *
 */

/* The Intents module contains a list of the possible intents that might be returned by the API */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^ConversationResponse$" }] */
/* global Animations: true, Api: true, Panel: true */

var ConversationResponse = (function () {
  'use strict';

  var matsi = document.getElementById('matsi');
  var cont = 0;

  return {
    init: init,
    responseHandler: responseHandler
  };

  function init() {
    setupResponseHandling();
  }

  // Create a callback when a new Watson response is received to handle Watson's response
  function setupResponseHandling() {
    var currentResponsePayloadSetter = Api.setWatsonPayload;
    Api.setWatsonPayload = function (payload) {
      currentResponsePayloadSetter.call(Api, payload);
      responseHandler(payload);
    };
  }



  // Called when a Watson response is received, manages the behavior of the app based
  // on the user intent that was determined by Watson
  function responseHandler(data) {

    var action = data.output.action;

    if (data && !data.output.error) {
      // Check if message is handled by retrieve and rank and there is no message set
      if (action && !data.output.text) {
        // TODO add EIR link
        data.output.text = ['I am not able to answer that. You can try asking the'
          + ' <a href="https://conversation-with-discovery.mybluemix.net/" target="_blank">Information Retrieval with Discovery App</a>'];

        Api.setWatsonPayload(data);
        return;
      }

      if (action) {
        console.log(action);
        if (action === 'start-interaction') {
          Matsi.showVideoBg();
          document.getElementById('instructions').setAttribute('class','hide');
        }
        if (action === 'blank') {
          //Matsi.hideVideoBackground();
          setTimeout(function () {
            if (cont === 1 || cont === 0) {
              cont++;
              window.location.reload(true);
            }
          },11500);
          ImageModule.clearPicture();
          CameraModule.hideCamera();
          CameraModule.clearCameraText();
        }
        if (action === 'info-node') {
          CameraModule.showCamera();
          setTimeout(function () {
            if (cont === 0) {
              cont++;
              return ImageModule.takepicture(true);
            }
          }, 7000);
        }
        if (action === 'secret-frase') {
          Matsi.showSpirit();
        }
      }
    }
  }

}());