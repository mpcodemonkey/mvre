/**
 * Created by ubufu on 11/8/2016.
 */

define('RotationController', ['BaseController', 'glmatrix'], function(BaseController, glmatrix) {

    var RotationController = function () {
        BaseController.call(this);

        this.defaultRotationRate = .05
        this.defaultCycleTime = 360;
    };
    RotationController.prototype = Object.create(BaseController.prototype);

    RotationController.prototype.update = function () {
        this.totalTime += this.defaultRotationRate;

        if (this.totalTime == this.defaultCycleTime) {
            //reset counter
            this.totalTime = 0.0;
        }

        glmatrix.mat4.identity(this.tMatrix);
        this.rotate(this.defaultRotationRate, glmatrix.vec3.fromValues(0,1,0));

        BaseController.prototype.update.call(this);
    }

    RotationController.prototype.setDefaultRotationRate = function(i){
        this.defaultRotationRate = i;
    }

    return RotationController;

});
