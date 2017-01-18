/**
 * Created by ubufu on 9/7/2016.
 */

requirejs.config({
  baseUrl: '',
    paths: {
      glmatrix: './third-party/gl-matrix-min',
      Skybox: './mvre/scene/Skybox',
      Cube: './mvre/scene/Cube',
      Shaders: './mvre/Shaders',
      Environment: './mvre/objects/Environment',
      TranslationController: './mvre/scene/TranslationController',
      RotationController: './mvre/scene/RotationController',
      BaseController: './mvre/scene/BaseController',
      Node: './mvre/scene/Node',
      NodeEntity: './mvre/Entity/NodeEntity',
      MeshComponent: './mvre/Component/MeshComponent',
      renderer: './mvre/renderer',
      engine: './mvre/Engine',
      polyfill: './third-party/webvr-polyfill',
      samples: './third-party/vr-samples-util',
      BaseGame: './mvre/BaseGame',
      Game: 'Game',
      EventEmitter: './third-party/EventEmitter.min',
      ModelLoader: './mvre/loader/ModelLoader',
      cuon: './third-party/cuon-utils'
    }
});

requirejs(['engine'], function(engine){


});