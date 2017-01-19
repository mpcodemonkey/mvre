/**
 * Created by ubufu on 1/18/2017.
 *
 * modified from https://raw.githubusercontent.com/toji/building-the-game/part-3/public/js/animation.js
 */

define('AnimationComponent', ['glmatrix'], function(glmatrix){

    //all animation information used by animated nodes
    //currently implemented:
    //skinIndices: X
    //skinWeights: X
    //bones: X
    //keyframes: X

    var AnimationComponent = function(){
        this.skinIndices = [],
        this.skinWeights = [],
        this.bones = [],
        this.keyframes = []
        this.animated = false;
    };

    AnimationComponent.prototype.name = 'AnimationComponent';

    return AnimationComponent;

});