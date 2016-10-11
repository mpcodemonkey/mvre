/**
 * Created by ubufu on 9/7/2016.
 */

requirejs.config({
  baseUrl: '',
    paths: {
      glmatrix: './third-party/gl-matrix-min',
      scene: './mvre/SceneNode',
      engine: './mvre/engine',
      polyfill: './third-party/webvr-polyfill',
      samples: './third-party/vr-samples-util',
      basegame: 'baseGame',
      cuon: './third-party/cuon-utils'
    }
});

requirejs(['engine'], function(engine){


});