
/*
 * Copyright © 2018. All rights reserved.
 *
*/



var TTSModule = (function() {
  'use strict';
  var audio = null; // Initialize audio to null
  var button = document.getElementById('output-audio');
  button.value = 'ON'; // TTS is default - not mute
  Common.hide(button); // In case user is using invalid browsers

  return {
    init: init,
    toggle: toggle
  };

  function init() {
    textToSpeech();
    checkBrowsers();
  }

  // Create a callback when a new Watson response is received to start speech
  function textToSpeech() {
    var currentResponsePayloadSetter = Api.setWatsonPayload;
    Api.setWatsonPayload = function(payload) {
      currentResponsePayloadSetter.call(Api, payload);
      if (payload.output.action === 'secret-frase'){
        var audio = new Audio('images/audio/magic_mirror_sound.mp3');
        audio.play();
        audio.volume= 1;
        Matsi.showSpirit();
        payload.output.text = 'Oh, sorry, I do not know what got into me. Please ignore that. Ehm... So, nice weather we are having today.';
        audio.onended = function() {
          Matsi.hideSpirit();
          Matsi.watsonRing();
          playCurrentAudio(payload.output);
        };
      } else if (payload.output.action != 'secret-frase')
          playCurrentAudio(payload.output); // Plays audio using output text
    };
  }

  // TTS only works in Chrome and Firefox
  function checkBrowsers() {
    if ((navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
      Common.show(button); // Show button only if in valid browsers
    }
  }

  // Toggle TTS/Mute button
  function toggle() {
    if (button.value === 'OFF') {
      button.value = 'ON';
      button.setAttribute('class', 'audio-on');
    } else {
      audio.pause(); // Pause the current audio if the toggle is turned OFF
      button.value = 'OFF';
      button.setAttribute('class', 'audio-off');
    }
  }

  // Stops the audio for an older message and plays audio for current message
  function playCurrentAudio(payload) {
    fetch('/api/text-to-speech/token') // Retrieve TTS token
      .then(function(response) {
        return response.text();
      }).then(function(token) {
        if (button.value === 'ON') {
          // Takes text, voice, and token and returns speech
          if (payload.text) { // If payload.text is defined
            // Pauses the audio for older message if there is a more current message
            if (audio !== null && !audio.ended) {
              audio.pause();
            }
            audio = WatsonSpeech.TextToSpeech.synthesize({
              text: payload.text, // Output text/response
              voice: 'en-US_MichaelVoice', // Default Watson voice
              //voice: 'en-US_AllisonVoice',
              autoPlay: true, // Automatically plays audio
              token: token
            });
            // When the audio stops playing
            audio.onended = function() {
              //payload.ref = 'STT';
              allowSTT(payload); // Check if user wants to use STT
            };
          } else {
            // Pauses the audio for older message if there is a more current message
            if (audio !== null && !audio.ended) {
              audio.pause();
            }
            // When payload.text is undefined
            allowSTT(payload); // Check if user wants to use STT
          }
        } else { // When TTS is muted
          payload.ref = 'STT';
          allowSTT(payload); // Check if user wants to use STT
        }
      });
  }

  function allowSTT(payload) {
    if (payload.ref === 'STT') {
      STTModule.speechToText();
    }
  }
})();
TTSModule.init(); // Runs Text to Speech Module
