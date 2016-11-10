/**
 * Created by ubufu on 11/8/2016.
 */

define('TranslationController', ['BaseController', 'glmatrix'], function(BaseController, glmatrix) {

    var TranslationController = function () {
        BaseController.call(this);

        this.defaultTranslationRate = .05
        this.defaultCycleTime = 360;
    };
    TranslationController.prototype = Object.create(BaseController.prototype);

    TranslationController.prototype.update = function () {
        this.totalTime += this.defaultTranslationRate;
        var step = this.defaultTranslationRate * this.totalTime;

        if (this.totalTime == this.defaultCycleTime) {
            //reset counter
            this.totalTime = 0.0;
        }

        glmatrix.mat4.identity(this.tMatrix);
        this.translate(Math.sin(this.totalTime), 0, 0);
        //this.rotate(0.05, glmatrix.vec3.fromValues(0,1,0));

        BaseController.prototype.update.call(this);
    }

    return TranslationController;

});
