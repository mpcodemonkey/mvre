/**
 * Created by ubufu on 11/8/2016.
 */

define('TranslationController', ['BaseController', 'glmatrix'], function(BaseController, glmatrix) {

    var TranslationController = function () {
        BaseController.call(this);

        this.defaultTranslationRate = .002;
        this.defaultCycleTime = 12;
        this.cycleDirection = 1;
    };
    TranslationController.prototype = Object.create(BaseController.prototype);

    TranslationController.prototype.update = function () {
        this.totalTime += 0.1;
        var step = this.defaultTranslationRate * this.totalTime;

        if (this.totalTime > this.defaultCycleTime) {
            //invert direction of movement
            this.cycleDirection = -this.cycleDirection;
            this.totalTime = 0.0;
        }

        step *= this.cycleDirection;

        this.translate(step, 0, 0);
        //this.rotate(0.05, glmatrix.vec3.fromValues(0,1,0));

        BaseController.prototype.update.call(this);
    }

    return TranslationController;

});
