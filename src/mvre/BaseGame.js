/**
 * Created by ubufu on 9/20/2016.
 */
define('BaseGame', ['cannon'],function (cannon){

    var BaseGame = function(Environment){
        this.environment = Environment;
        this.physicsEnabled = false;
        this.physicsWorld = null;
        this.lastTime = null;
    }

    BaseGame.prototype.init = function(gl){
        //override in child class

        return null;
    }

    BaseGame.prototype.enablePhysics = function(){
        this.physicsEnabled = true;
        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0,-9.81,0); //default gravity, in m/s^2
        this.physicsWorld.broadphase = new CANNON.NaiveBroadphase();

    }

    BaseGame.prototype.disablePhysics = function(){
        this.physicsEnabled = false;
    }

    BaseGame.prototype.addToPhysicalWorld = function(node){
        if(node.components.PhysicsComponent.boundingObject != null)
            this.physicsWorld.addBody(node.components.PhysicsComponent.boundingObject);
    }

    //teleport the world to the camera
    BaseGame.prototype.teleport = function(){

    }

    BaseGame.prototype.update = function (delta){
        if(this.physicsEnabled){
            //update physics world here. Handle collision in teleport function
            this._updatePhysics(delta);
        }
    }

    BaseGame.prototype._updatePhysics = function(time){
        if(this.lastTime !== undefined) {
            var dt = (time - this.lastTime) / 1000;
        }
        this.physicsWorld.step(1/60.0, dt, 3);
        this.lastTime = time;


        //todo: create line cast for camera, check if intersects with object for teleport
    }

    return BaseGame;
});