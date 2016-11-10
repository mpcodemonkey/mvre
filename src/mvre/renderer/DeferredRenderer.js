/**
 * Created by ubufu on 11/10/2016.
 */

/**
 * This will be a test of how deferred rendering will work in webgl. I'm
 * not going to worry about the lack of transparency support at the moment.
 * The performance increase with lighting sources is well worth the risk
 * of losing support for transparency.
 **/

define('BaseRenderer',['glmatrix'], function(glmatrix) {

    var BaseRenderer = function(){

    }

    BaseRenderer.prototype.render = function(){
        //overwrite in subclasses
    }

    return BaseRenderer;
});