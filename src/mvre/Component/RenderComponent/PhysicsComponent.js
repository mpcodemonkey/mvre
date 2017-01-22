/**
 * Created by ubufu on 1/20/2017.
 */

define('PhysicsComponent', ['glmatrix', 'cannon'], function(glmatrix, cannon){

    //all information used by lit nodes
    //currently implemented:
    //normals: O

    var PhysicsComponent = function(){
        this.physicsBody = null;
        //used for bounding box calculation later
        this.min = null;
        this.max = null;
        this.physicsWorld = null;
        this.boundingObject = null

        this.VShaderAttributes = [
            ""
        ].join("\n");

        this.VShaderOutput = [
            ""
        ].join("\n");

        this.VShaderMain = [
            ""
        ].join("\n");

        this.FShaderAttributes = [
            ""
        ].join("\n");

        this.FShaderOutput = [
            ""
        ].join("\n");

        this.FShaderMain = [
            ""
        ].join("\n");
    };

    PhysicsComponent.prototype.name = 'PhysicsComponent';

    PhysicsComponent.prototype.build = function(gl, node){
        var shape = new CANNON.Box(new CANNON.Vec3(
            (this.max[0] - this.min[0]) / 2,
            (this.max[1] - this.min[1]) / 2,
            (this.max[2] - this.min[2]) / 2
        ));

        this.boundingObject = new CANNON.Body({mass: 1});
        this.boundingObject.addShape(shape);
        var pos = glmatrix.vec3.create();
        glmatrix.mat4.getTranslation(pos, node.tMatrix);
        this.boundingObject.position.x = pos[0];
        this.boundingObject.position.y = pos[1];
        this.boundingObject.position.z = pos[2];
        this.boundingObject.computeAABB();
        // disable collision response so objects don't move when they collide
        // against each other
        this.boundingObject.collisionResponse = false;

        this._addToPhysicsWorld();

    }

    PhysicsComponent.prototype.apply = function(gl, node){
        glmatrix.mat4.identity(node.tMatrix);
        //node.translate(0,0,-4);
        node.translate(this.boundingObject.position.x, this.boundingObject.position.y, this.boundingObject.position.z);
        var pos = glmatrix.vec3.create();
        glmatrix.mat4.getTranslation(pos, node.tMatrix);
        //console.log(pos);
    }

    PhysicsComponent.prototype._addToPhysicsWorld = function(){
        this.physicsWorld.addBody(this.boundingObject);
    }

    return PhysicsComponent;

});