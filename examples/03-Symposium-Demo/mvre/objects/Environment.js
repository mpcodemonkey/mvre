/**
 * Created by ubufu on 11/10/2016.
 */

define('Environment',[], function() {

    var Environment = function(){
        this.world = [];

        Object.defineProperty(this.world, 'world', {
            value: 'world',
            writable: false,
            enumerable: true,
            configurable: true
        });
    }

    Environment.prototype.addNode = function(element){
        this.world.push(element)
    }

    Environment.prototype.removeNode = function(element){
        var index = this.world.indexOf(element);

        if(index > -1){
            this.world.splice(index, 1);
        }
    }
    Environment.prototype.removeNodeByIndex = function(index){
        this.world.splice(index, 1);
    }

    Environment.prototype.getEnvironmentAsList = function(){
        return this.world;
    }


    return Environment;
});