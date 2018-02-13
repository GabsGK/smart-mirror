
/*
 * Copyright © 2018. All rights reserved.
 *
*/


var STTModule = (function() {
  'use strict';
  var mic        = document.getElementById('input-mic');
  var recording  = false;
  var stream;
  var records    = 0;
  var matsi = document.getElementById('matsi');

  return {
    micON: micON,
    speechToText: speechToText,
    init: init
  };

  function init() {
    checkBrowsers();
  }

  function checkBrowsers() {
    // Check if browser supports speech
    if (!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
      Common.hide(mic);
    }
  }

  function micON() { // When the microphone button is clicked
    if (recording === false) {
      if (records === 0) { // The first time the mic is clicked - inform user
        Api.setWatsonPayload({output: {text: ['Accept the microphone prompt in your browser. Watson will listen soon.'], ref: 'STT'}}); // Dialog box output to let the user know we're recording
        records++;
      } else {
        Api.setWatsonPayload({output: {ref: 'STT'}}); // Let the user record right away
      }
    } else {
      recording = false;
      try {
        stream.stop();
      } catch(e){
        console.log(e);
      }
    }
  }

  function speechToText() {
    mic.setAttribute('class', 'active-mic');  // Set CSS class of mic to indicate that we're currently listening to user input
    Matsi.userRing();                         // Start user speaking animation
    recording = true;                         // We'll be recording very shortly
    fetch('/api/speech-to-text/token')        // Fetch authorization token for Watson Speech-To-Text
      .then(function(response) {
        return response.text();
      })
      .then(function(token) {                 // Pass token to Watson Speech-To-Text service
        stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
          token: token,                       // Authorization token to use this service, configured from /speech/stt-token.js file
          continuous: false,                  // False = automatically stop transcription the first time a pause is detected. Deprecated, won't work. Use stream.stop()
          outputElement: '#user-input',       // CSS selector or DOM Element
          inactivity_timeout: 7,              // Number of seconds to wait before closing input stream
          format: false,                      // Inhibits errors
          keepMicrophone: true                // Avoids repeated permissions prompts in FireFox
        });

        stream.on('data', function(data) {
          if(data.final) {
            stream.stop();
          }
        });

        stream.promise()                                // Once all data has been processed...
          .then(function(data) {                        // ...put all of it into a single array
            mic.setAttribute('class', 'inactive-mic');  // Reset our microphone button to visually indicate we aren't listening to user anymore
            recording = false;                          // We aren't recording anymore
            if (data.length !== 0) {                    // If data is not empty (the user said something)
              var dialogue = data.pop();                // Get the last data variable from the data array, which will be the finalized Speech-To-Text transcript
              if ((dialogue.alternatives[0].transcript !== '') && (dialogue.final === true)) { // Another check to verify that the transcript is not empty and that this is the final dialog
                Conversation.sendMessage();             // Send the message to Watson Conversation
              }
            } else { // If there isn't any data to be handled by the conversation, display a message to the user letting them know
              Api.setWatsonPayload({output: {text: ['Microphone input cancelled. Please press the button to speak to Watson again']}}); // If the user clicked the microphone button again to cancel current input
            }
          })
          .catch(function(err) { // Catch any errors made during the promise
            if (err !== 'Error: No speech detected for 5s.') { // This error will always occur when Speech-To-Text times out, so don't log it (but log everything else)
              console.log(err);
            }
            Matsi.noRing();
            mic.setAttribute('class', 'inactive-mic'); // Reset our microphone button to visually indicate we aren't listening to user anymore
            /* Api.setWatsonPayload({output: {text: ['Howdy'],ref: 'STT'}}); */
            Api.postConversationMessage("What's the weather?");
          });
      })
      .catch(function(error) { // Catch any other errors and log them
        console.log(error);
      });
  }
})();

STTModule.init(); // Runs Speech to Text Module
