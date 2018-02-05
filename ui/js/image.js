var ImageModule = (function () {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var constraints = { video: true, audio: false };

    return {
        startup: startup,
        takepicture: takepicture,
        clearPicture: clearPicture
    }

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                var videoTracks = stream.getVideoTracks();
                stream.onremovetrack = function () {
                    console.log('Stream ended');
                };
                window.stream = stream; // make variable available to browser console
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log(err);
                /* handle the error */
            });

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

    }
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture(print) {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            console.log(print)
            //Post image to server with XHR.
            postImage(data,print);
        }
    }

    function postImage(data,print) {
        var xhr = new XMLHttpRequest(),
            postdata = {
                image: data
            };

        //Post image to server

        xhr.open('POST', '/image');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200 && xhr.responseText) {
                var response = JSON.parse(xhr.responseText);
                var picResponse = document.getElementById('pic-response');
                if (response.images[0].faces.length != 0) {
                    var div = document.createElement('div');
                    var length = response.images[0].faces.length;
                    if (length != 0) {
                        if (print === true) {
                            console.log(response.images[0].faces)
                            for (i = 0; i < length; i++) {
                                var gender = document.createElement('p');
                                var age = document.createElement('p');
                                gender.innerText = response.images[0].faces[i].gender.gender.toLowerCase();
                                age.innerText = 'between ' + response.images[0].faces[i].age.min + ' and ' + response.images[0].faces[i].age.max + ' years';
                                div.appendChild(gender);
                                div.appendChild(age);
                            }
                            picResponse.innerHTML = div.innerHTML;
                        } else if (print === false) {
                            console.log('yes');
                            return 'yes';
                        }
                    }                 
                }
            }
            else if (xhr.status !== 200) {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send(JSON.stringify(postdata));
    }

    function clearPicture() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    //window.addEventListener('load', startup, false);
})();

//ImageModule.startup();