var CameraModule = (function(){
    var camera = document.getElementById('camera-wrapper');
    var cameraText = document.getElementById('pic-response');
    var canvas = document.getElementById('canvas');

    return {
        showCamera: showCamera,
        hideCamera: hideCamera,
        clearCameraText: clearCameraText/* ,
        isUserThere: isUserThere */
    }

    // Pending to build camera when user says "Yes"

    function showCamera(){
        camera.setAttribute('class','');
    }

    function hideCamera(){
        camera.setAttribute('class','hide');
    }

    function clearCameraText() {
        cameraText.innerHTML = '';
    }

    /* function isUserThere(){
        
    } */
})();