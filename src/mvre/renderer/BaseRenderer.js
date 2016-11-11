/**
 * Created by ubufu on 11/10/2016.
 */

define('BaseRenderer',[], function() {

    var BaseRenderer = function(gl, width, height){
        this.gl = gl;
        this.width = width;
        this.height = height;
    };

    BaseRenderer.prototype.render = function(node, pMat, vMat){
        //overwrite in subclasses
    }

    BaseRenderer.prototype.setRenderDimensions = function(width, height){
        this.width = width;
        this.height = height;
    }

    return BaseRenderer;
});