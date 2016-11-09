/**
 * Created by ubufu on 11/8/2016.
 */

define('BaseController', ['Node'], function(Node){

    var BaseController = function(){
        Node.call(this, "controller");

        this.totalTime = 0;
    };

    BaseController.prototype = Object.create(Node.prototype);


    BaseController.prototype.update = function(){
        Node.prototype.update.call(this);
    };

    return BaseController;

});