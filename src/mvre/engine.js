/*
Copyright 2016 The Chromium Authors. All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/

//Modified by Jonathan Tinney as an entry point for the mobile virtual reality engine

/**
 * This is the engine entry point. using requirejs,
 * we can now load all of the required objects and
 * functions from each external js file. this greatly
 * improves code readability, and allows for imports
 * to function more like java. You simple add a path to
 * main.js where your scripts are located, and then they
 * become usable in the engine.
 */

define( ['glmatrix', 'samples', 'polyfill', 'basegame', 'scene'], function (glmatrix, samples, polyfill, basegame, SceneNode) {

    "use strict";


    // global objects
    var scenegraph = null;

    /* This entire block in only to facilitate dynamically enabling and
     disabling the WebVR polyfill, and is not necessary for most WebVR apps.
     If you want to use the polyfill in your app, just include the js file and
     everything will work the way you want it to by default. */
    var WebVRConfig = {
        // Polyfill optimizations
        DIRTY_SUBMIT_FRAME_BINDINGS: true,
        BUFFER_SCALE: 0.5,
        FORCE_ENABLE_VR: false
    };

    //End sample polyfill enabling logic

    var vrDisplay = null;
    var projectionMat = glmatrix.mat4.create();
    var viewMat = glmatrix.mat4.create();

    var vrPresentButton = null;

    // ===================================================
    // WebGL scene setup. This code is not WebVR specific.
    // ===================================================

    // WebGL setup.
    var webglCanvas = document.getElementById("webgl-canvas");
    var glAttribs = {
        alpha: false,
        antialias: VRSamplesUtil.isMobile(),
    };
    var gl = webglCanvas.getContext("webgl", glAttribs);
    gl.clearColor(0.1, 0.2, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var presentingMessage = document.getElementById("presenting-message");

    // ================================
    // WebVR-specific code begins here.
    // ================================

    function onVRRequestPresent () {
        // This can only be called in response to a user gesture.
        vrDisplay.requestPresent([{ source: webglCanvas }]).then(function () {
            // Nothing to do because we're handling things in onVRPresentChange.
        }, function () {
            VRSamplesUtil.addError("requestPresent failed.", 2000);
        });
    }

    function onVRExitPresent () {
        // No sense in exiting presentation if we're not actually presenting.
        // (This may happen if we get an event like vrdisplaydeactivate when
        // we weren't presenting.)
        if (!vrDisplay.isPresenting)
            return;

        vrDisplay.exitPresent().then(function () {
            // Nothing to do because we're handling things in onVRPresentChange.
        }, function () {
            VRSamplesUtil.addError("exitPresent failed.", 2000);
        });
    }

    function onVRPresentChange () {
        // When we begin or end presenting, the canvas should be resized to the
        // recommended dimensions for the display.
        onResize();

        if (vrDisplay.isPresenting) {
            if (vrDisplay.capabilities.hasExternalDisplay) {
                // Because we're not mirroring any images on an external screen will
                // freeze while presenting. It's better to replace it with a message
                // indicating that content is being shown on the VRDisplay.
                presentingMessage.style.display = "block";

                // On devices with an external display the UA may not provide a way
                // to exit VR presentation mode, so we should provide one ourselves.
                VRSamplesUtil.removeButton(vrPresentButton);
                vrPresentButton = VRSamplesUtil.addButton("Exit VR", "E", "/third-party/media/icons/cardboard64.png", onVRExitPresent);
            }
        } else {
            // If we have an external display take down the presenting message and
            // change the button back to "Enter VR".
            if (vrDisplay.capabilities.hasExternalDisplay) {
                presentingMessage.style.display = "";

                VRSamplesUtil.removeButton(vrPresentButton);
                vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "/third-party/media/icons/cardboard64.png", onVRRequestPresent);
            }
        }
    }

    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function (displays) {
            if (displays.length > 0) {
                vrDisplay = displays[0];

                // It's heighly reccommended that you set the near and far planes to
                // something appropriate for your scene so the projection matricies
                // WebVR produces have a well scaled depth buffer.
                vrDisplay.depthNear = 0.1;
                vrDisplay.depthFar = 1024.0;

                VRSamplesUtil.addButton("Reset Pose", "R", null, function () { vrDisplay.resetPose(); });

                // Generally, you want to wait until VR support is confirmed and
                // you know the user has a VRDisplay capable of presenting connected
                // before adding UI that advertises VR features.
                if (vrDisplay.capabilities.canPresent)
                    vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "/third-party/media/icons/cardboard64.png", onVRRequestPresent);

                // The UA may kick us out of VR present mode for any reason, so to
                // ensure we always know when we begin/end presenting we need to
                // listen for vrdisplaypresentchange events.
                window.addEventListener('vrdisplaypresentchange', onVRPresentChange, false);

                // These events fire when the user agent has had some indication that
                // it would be appropariate to enter or exit VR presentation mode, such
                // as the user putting on a headset and triggering a proximity sensor.
                // You can inspect the `reason` property of the event to learn why the
                // event was fired, but in this case we're going to always trust the
                // event and enter or exit VR presentation mode when asked.
                window.addEventListener('vrdisplayactivate', onVRRequestPresent, false);
                window.addEventListener('vrdisplaydeactivate', onVRExitPresent, false);
            } else {
                VRSamplesUtil.addInfo("WebVR supported, but no VRDisplays found.", 3000);
            }
        });
    } else if (navigator.getVRDevices) {
        VRSamplesUtil.addError("Your browser supports WebVR but not the latest version. See <a href='http://webvr.info'>webvr.info</a> for more info.");
    } else {
        VRSamplesUtil.addError("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.");
    }

    function onResize () {
        if (vrDisplay && vrDisplay.isPresenting) {
            // If we're presenting we want to use the drawing buffer size
            // recommended by the VRDevice, since that will ensure the best
            // results post-distortion.
            var leftEye = vrDisplay.getEyeParameters("left");
            var rightEye = vrDisplay.getEyeParameters("right");

            // For simplicity we're going to render both eyes at the same size,
            // even if one eye needs less resolution. You can render each eye at
            // the exact size it needs, but you'll need to adjust the viewports to
            // account for that.
            webglCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
            webglCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
        } else {
            // We only want to change the size of the canvas drawing buffer to
            // match the window dimensions when we're not presenting.
            webglCanvas.width = webglCanvas.offsetWidth * window.devicePixelRatio;
            webglCanvas.height = webglCanvas.offsetHeight * window.devicePixelRatio;
        }
    }
    window.addEventListener("resize", onResize, false);
    onResize();

    var frameData = new VRFrameData();

    //initialize game setup
    scenegraph = init(gl);

    function render(){
    }

    /**
     * Render loop for engine
     * @param time
     */
    function onAnimationFrame (t) {

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        if (vrDisplay) {
            // When presenting content to the VRDisplay we want to update at its
            // refresh rate if it differs from the refresh rate of the main
            // display. Calling VRDisplay.requestAnimationFrame ensures we render
            // at the right speed for VR.
            vrDisplay.requestAnimationFrame(onAnimationFrame);

            // As a general rule you want to get the pose as late as possible
            // and call VRDisplay.submitFrame as early as possible after
            // retrieving the pose. Do any work for the frame that doesn't need
            // to know the pose earlier to ensure the lowest latency possible.
            //var pose = vrDisplay.getPose();
            //vrDisplay.getFrameData(frameData);

            if (vrDisplay.isPresenting) {
                // When presenting render a stereo view.
                gl.viewport(0, 0, webglCanvas.width * 0.5, webglCanvas.height);
                // render scenegraph for left eye here
                if(scenegraph)
                    scenegraph.render(gl, projectionMat, viewMat, vrDisplay.getEyeParameters("Left"));

                gl.viewport(webglCanvas.width * 0.5, 0, webglCanvas.width * 0.5, webglCanvas.height);
                // render scenegraph for right eye here
                //root.render(gl, projectionMat, viewMat, vrDisplay.getEyeParameters("Right"));

                // If we're currently presenting to the VRDisplay we need to
                // explicitly indicate we're done rendering.
                vrDisplay.submitFrame();
            } else {
                // When not presenting render a mono view that still takes pose into
                // account.
                gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
                // It's best to use our own projection matrix in this case, but we can use the left eye's view matrix
                if(scenegraph != null)
                    scenegraph.render(gl, projectionMat, viewMat, vrDisplay.getEyeParameters("Left"));
            }
        } else {
            window.requestAnimationFrame(onAnimationFrame);

            // No VRDisplay found.
            gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
        }
    }
    window.requestAnimationFrame(onAnimationFrame);

});
