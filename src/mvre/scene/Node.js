/**
 * Created by ubufu on 11/8/2016.
 */

/**
 * This class is based off of the tutorial by Erik Hazzard located at http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
 */

define('Node',['glmatrix', 'NodeEntity', 'cuon', 'MeshComponent', 'TextureComponent', 'PhysicsComponent'], function(glmatrix, NodeEntity, cuon, MeshComponent, TextureComponent, PhysicsComponent){

    var Node = function(name){
        NodeEntity.call(this);
        this.name = name;
        this.tMatrix = glmatrix.mat4.create();
        this.rMatrix = glmatrix.mat4.create();
        this.sMatrix = glmatrix.mat4.create();
        this.lMatrix = glmatrix.mat4.create();
        this.wMatrix = glmatrix.mat4.create();


        //create base component for mesh information
        this.addComponent(new MeshComponent('Mesh'));
        //this.addComponent(new TextureComponent('Texture'));
        //this.addComponent(new PhysicsComponent('physics'));

        //all other components are optional.

        this.parent = null;
        this.children = [];
        this.drawable = false;

        //program
        this.program = null;

        //uniforms
        this.projectionMat = null;
        this.modelViewMat = null;
        this.transMat = null;


    }

    Node.prototype = Object.create(NodeEntity.prototype);

    Node.prototype.build = function (gl) {

        var self = this;
        //create shader program
        //this.program = createProgram(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        this.program = createProgramFromComponents(this, gl);

        //initialize index buffer
        //this.indexBuffer = initBuffer(gl);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        //this.indexCount = this.indices.length;

        //temp: build texture
        Object.values(this.components).forEach(function(component){
            component.build(gl, self);
        })

        //get positions for model, view, and translate matrices
        this.projectionMat = gl.getUniformLocation(this.program, "projectionMat");
        this.modelViewMat = gl.getUniformLocation(this.program, "modelViewMat");
        this.transMat = gl.getUniformLocation(this.program, "transMat");


        this.setDrawable(true);
    }


    Node.prototype.setImageSrc = function(source){
        if(this.components.TextureComponent != null)
            this.components.TextureComponent.imageSrc = source;
        else
            console.log('No texture component to apply image to');
    }

    Node.prototype.setPhysicsWorld = function(world){
        if(this.components.PhysicsComponent != null)
            this.components.PhysicsComponent.physicsWorld = world;
        else
            console.log('No physics component to apply world to');
    }

    Node.prototype.translate = function (x, y, z) {
        var translateVector = glmatrix.vec3.fromValues(x, y, z);
        glmatrix.mat4.translate(this.tMatrix, this.tMatrix, translateVector);

        //translate physics body if physics is enabled
        if(typeof this.components.PhysicsComponent != "undefined"){

            //todo: fix order of physics object/mesh creation so this doesn't need to happen
            var pos = glmatrix.vec3.create();
            glmatrix.mat4.getTranslation(pos, this.tMatrix);
            if(this.components.PhysicsComponent.boundingObject == null){
                this.components.PhysicsComponent.dirtyX = pos[0];
                this.components.PhysicsComponent.dirtyY = pos[1];
                this.components.PhysicsComponent.dirtyZ = pos[2];
            }
            else{
                this.components.PhysicsComponent.boundingObject.position.x = pos[0];
                this.components.PhysicsComponent.boundingObject.position.y = pos[1];
                this.components.PhysicsComponent.boundingObject.position.z = pos[2];
            }

        }
    }

    Node.prototype.rotate = function (radians, axis) {
        glmatrix.mat4.rotate(this.rMatrix, this.rMatrix, radians, axis);
    }

    Node.prototype.scale = function (x, y, z) {
        glmatrix.mat4.scale(this.sMatrix, this.sMatrix, glmatrix.vec3.fromValues(x, y, z))
    }

    Node.prototype.computeLocalMatrix = function(){
        var tmp = glmatrix.mat4.create();
        glmatrix.mat4.mul(tmp, this.rMatrix, this.sMatrix);
        glmatrix.mat4.mul(this.lMatrix, this.tMatrix, tmp);
    }

    Node.prototype.isLeaf = function () {
        return this.children.length == 0;
    }

    //from http://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html
    //modified for use with glmatrix
    Node.prototype.updateWorldMatrix = function(parent) {
        if (parent) {
            //compute local matrix for children nodes
            this.computeLocalMatrix();
            // parent exists, update world matrix with
            // parent world matrix
            glmatrix.mat4.mul(this.wMatrix, parent.wMatrix, this.lMatrix);
        } else {
            // no matrix was passed in so just copy lMatrix to wMatrix
            glmatrix.mat4.copy(this.wMatrix, this.lMatrix);
        }

    }

    //from http://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html
    //proper way to set parent/child node relationship without multi-parenting
    Node.prototype.setParent = function(parent){
        // remove us from our parent
        if (this.parent) {
            var ndx = this.parent.children.indexOf(this);
            if (ndx >= 0) {
                this.parent.children.splice(ndx, 1);
            }
        }

        // Add us to our new parent
        if (parent) {
            parent.children.push(this);
        }
        this.parent = parent;
    }

    Node.prototype.update = function(){
        this.computeLocalMatrix();

        //compute the global matrix
        this.updateWorldMatrix(this.parent);

        //do the same for children
        this.children.forEach(function(child) {
            child.update();
        });
    }

    Node.prototype.isDrawable = function(){
        return this.drawable;
    }

    Node.prototype.setDrawable = function(b){
        this.drawable = b;
    }

    Node.prototype.render = function(gl){
        gl.drawArrays(gl.TRIANGLES, 0, this.components.MeshComponent.vertices.length/3);
    }

    return Node;

});



