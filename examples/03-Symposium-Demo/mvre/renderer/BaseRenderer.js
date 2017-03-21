/**
 * Created by ubufu on 11/10/2016.
 */

define('BaseRenderer',['glmatrix'], function(glmatrix) {

    var BaseRenderer = function(){

    }

    BaseRenderer.prototype.render = function(){
        //overwrite in subclasses
    }

    return BaseRenderer;
});