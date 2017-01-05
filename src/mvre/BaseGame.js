/**
 * Created by ubufu on 9/20/2016.
 */
define('BaseGame', [],function (){

    var BaseGame = function(Environment){
        this.environment = Environment;
    }

    BaseGame.prototype.init = function(gl){
        //override in child class

        return null;
    }


    BaseGame.prototype.update = function (){
        //override in child class
    }

    return BaseGame;
});