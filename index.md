# MVRE

## Introduction
MVRE is a mobile virtual reality game engine built on top of WebGL and WebVR. Its purpose as of now is to show the extent to which the WebVR spec and WebGL 2.0 have matured, and to serve as an intermediate introduction for those looking to develop web-based VR games. Although the focus is on mobile, any game produced using this engine is (unless directly stated) playable on any desktop VR device.

This project is heavily based on the work done by Brandon Jones in his VR Presentation example. It uses webvr-polyfill by default until WebVR is enabled in Google Chrome and Mozilla Firefox by default.

## Status
Currently, this is an extremely alpha demo of webvr using webgl 2.0. The demo draws a pyramid with vertex colors based off of vertex world coordinate positions. This demo works in Chrome and Firefox on desktop, as well as Chrome Dev and Firefox Aurora on android devices. In aurora, you will need to disable the VR DOM object for the polyfill to work.

## Working Examples
* [#1-Webgl2-and-Scenegraph](https://mpcodemonkey.github.io/mvre/examples/01-Webgl2-and-Scenegraph/)
* [#2-Textured-Objects](https://mpcodemonkey.github.io/mvre/examples/02-Textured-Objects/)

## Planned Features
* 3D Audio

## In-progress Features
* Physics - gravity is present, collision detection currently underway. Cannon.js used for physics
* HUD - based on wglu-stats.js made by Brandon Jones

## Completed Features
* Validation of Webgl 2.0 support in WebVR
* Scenegraph - single parent, multiple child graph
* Wavefront .OBJ support, ported from the java version present in __Computer Graphics Programming in OpenGL with Java__ by Scott Gordon and John Clevenger

## Future Work
* Lighting and Shadows - lighting and shadows are not currently in the scope of this project. The original purpose was to identify and create a simple to use engine for mobile VR. It's emphasis is on checking the current state of WebVR. Lighting is an important engine feature, but does not add to the research being done.
* Skeletal animation - Andrea Venuta provides a wonderful explanation [here](http://veeenu.github.io/2014/05/09/implementing-skeletal-animation.html) on how skeletal animation works conceptually, and provides some code that can be used as a basis for animation in this engine. Given the time, I would love to work on finishing this.

## Notes
Game engine development is hard but rewarding. Never let the difficulty of a project be a roadblock that turns you away.
