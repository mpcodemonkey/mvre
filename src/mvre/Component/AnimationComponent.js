/**
 * Created by ubufu on 1/18/2017.
 */

define('AnimationComponent', [], function(){

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
    };

    //todo: add functions for stepping through keyframes. Note: some coupling between mesh/animation components will exist

    AnimationComponent.prototype.name = 'AnimationComponent';

    return AnimationComponent;

});