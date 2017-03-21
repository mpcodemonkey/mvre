/**
 * Created by ubufu on 1/20/2017.
 */

define('PhysicsComponent', ['glmatrix', 'cannon'], function(glmatrix, cannon){

    //all information used by lit nodes
    //currently implemented:
    //normals: O

    var PhysicsComponent = function(node){
        //used for bounding box calculation later
        this.min = null;
        this.max = null;
        this.physicsWorld = null;
        this.boundingObject = null;
        this.collisionResponse = false;
        this.mass = 0;
        this.parent = node;
        this.boundingType = "box";

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
        if(this.max === null || this.min === null){
            this._computeMinMax(node);
        }


        var shape = null;

        if(this.boundingType === "sphere"){
            var radius = this.max[0] - this.min[0];
            radius = radius < this.max[1] - this.min[1] ? this.max[1] - this.min[1] : radius;
            radius = radius < this.max[2] - this.min[2] ? this.max[2] - this.min[2] : radius;
            shape = new CANNON.Sphere(radius);
        }else{
            shape = new CANNON.Box(new CANNON.Vec3(
                (this.max[0] - this.min[0]) / 2,
                (this.max[1] - this.min[1]) / 2,
                (this.max[2] - this.min[2]) / 2
            ));
        }


        this.boundingObject = new CANNON.Body({mass: this.mass});
        this.boundingObject.addShape(shape);
        var pos = glmatrix.vec3.create();
        glmatrix.mat4.getTranslation(pos, node.tMatrix);
        if(this.dirtyX != null){
            this.boundingObject.position.x = this.dirtyX;
            this.boundingObject.position.y = this.dirtyY;
            this.boundingObject.position.z = this.dirtyZ;
        }
        else{
            this.boundingObject.position.x = pos[0];
            this.boundingObject.position.y = pos[1];
            this.boundingObject.position.z = pos[2];
        }

        //get rotation information from the node's rotation matrix, convert to quat
        var rotationQuat = glmatrix.quat.create();
        glmatrix.mat4.getRotation(rotationQuat, node.rMatrix);
        this.boundingObject.quaternion.x = rotationQuat[0];
        this.boundingObject.quaternion.y = rotationQuat[1];
        this.boundingObject.quaternion.z = rotationQuat[2];
        this.boundingObject.quaternion.w = rotationQuat[3];

        //compute the axis-aligned bounding box for the given object
        this.boundingObject.computeAABB();
        // disable collision response so objects don't move when they collide
        // against each other
        this.boundingObject.collisionResponse = this.collisionResponse;


        //set the bounding object's parent for collision responses
        this.boundingObject.parent = this.parent;
        this._addToPhysicsWorld();
    }

    PhysicsComponent.prototype._computeMinMax = function(node){
        var self = this;
        let vertices = node.components.MeshComponent.vertices;
        for(i = 0; i < vertices.length; i+= 3){
            let testPoint = glmatrix.vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);

            if(self.min == null || self.max == null){
                self.min = glmatrix.vec3.fromValues(testPoint[0], testPoint[1], testPoint[2]);
                self.max = glmatrix.vec3.fromValues(testPoint[0], testPoint[1], testPoint[2]);
            }

            if ( testPoint[0] < self.min[0] ) self.min[0]  = testPoint[0] ;
            if ( testPoint[1] < self.min[1] ) self.min[1]  = testPoint[1] ;
            if ( testPoint[2] < self.min[2] ) self.min[2]  = testPoint[2] ;
            if ( testPoint[0] > self.max[0] ) self.max[0]  = testPoint[0] ;
            if ( testPoint[1] > self.max[1] ) self.max[1]  = testPoint[1] ;
            if ( testPoint[2] > self.max[2] ) self.max[2]  = testPoint[2] ;
        }

    }

    PhysicsComponent.prototype.apply = function(gl, node){
        //get quat, overwrite rotation matrix(objects with no physics rotation should be fine)
        let tmpQuat = glmatrix.quat.fromValues(this.boundingObject.quaternion.x, this.boundingObject.quaternion.y, this.boundingObject.quaternion.z, this.boundingObject.quaternion.w);
        glmatrix.mat4.identity(node.rMatrix);
        glmatrix.mat4.fromQuat(node.rMatrix, tmpQuat)

        glmatrix.mat4.identity(node.tMatrix);
        node.translate(this.boundingObject.position.x, this.boundingObject.position.y, this.boundingObject.position.z);
    }

    PhysicsComponent.prototype._addToPhysicsWorld = function(node){
        this.physicsWorld.addBody(this.boundingObject);
    }

    PhysicsComponent.prototype.setCollisionResponse = function(b){
        this.collisionResponse = b;
    }

    PhysicsComponent.prototype.setMass = function(m){
        this.mass = m;
    }

    PhysicsComponent.prototype.setBoundingType = function(type){
        this.boundingType = type;
    }

    return PhysicsComponent;

});