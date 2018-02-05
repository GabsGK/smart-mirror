/*
 * Copyright © 2018. All rights reserved.
 *
*/

/* Major reformat needed!!!!! */
var Matsi = (function () {
    var videoBg = document.getElementById('video-bg');
    var ringsContainer = document.getElementById('rings-container');
    var userRingContainer = document.getElementById('user-video');
    var watsonRingContainer = document.getElementById('watson-video');
    var spiritContainer = document.getElementById('spirit-container');
    var spiritVideo = document.getElementById('spirit-video');
    var voice = document.getElementById('matsi-voice');

    return {
        showVideoBg: showVideoBg,
        hideVideoBackground: hideVideoBackground,
        userRing: userRing,
        watsonRing: watsonRing,
        noRing: noRing,
        showRings: showRings,
        showSpirit: showSpirit,
        hideSpirit: hideSpirit
    }

    function showVideoBg() {
        videoBg.setAttribute('class', 'block-wrapper');
    }

    function hideVideoBackground() {
        videoBg.setAttribute('class', 'hide');
    }

    function userRing() {
        ringsContainer.setAttribute('class', '');
        watsonRingContainer.setAttribute('class', 'hide');
        userRingContainer.setAttribute('class', 'bg-video');
    }

    function watsonRing() {
        ringsContainer.setAttribute('class', '');
        userRingContainer.setAttribute('class', 'hide');
        watsonRingContainer.setAttribute('class', 'bg-video');
    }

    function noRing() {
        ringsContainer.setAttribute('class', 'hide');
    }

    function showRings() {
        ringsContainer.setAttribute('class', '');
    }

    function hideSpirit() {
        spiritContainer.setAttribute('class', 'hide');
        spiritVideo.setAttribute('class','hide')
    }

    function showSpirit() {
        noRing();
        //matsiVoiceOn();
        showEvil();
        ImageModule.clearPicture();
        CameraModule.hideCamera();
        CameraModule.clearCameraText();
    }

    function showEvil() {
        spiritContainer.setAttribute('class', '');
        spiritVideo.setAttribute('class','bg-video')
    }

    function matsiVoiceOn() {
        var audio = new Audio('images/audio/magic_mirror_sound.mp3');
        audio.play();
        audio.volume = 1;
    }

    /* function hiedeSpirit() {
        TTSModule.playCurrentAudio()
        
    } */

}());