/**
 * Created by ubufu on 11/8/2016.
 */

/**
 * This class is based off of the tutorial by Erik Hazzard located at http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
 */

define('Node',['glmatrix'], function(glmatrix){

    var Node = function(name){
        this.name = name;
        this.tMatrix = glmatrix.mat4.create();
        this.rMatrix = glmatrix.mat4.create();
        this.sMatrix = glmatrix.mat4.create();
        this.lMatrix = glmatrix.mat4.create();
        this.wMatrix = glmatrix.mat4.create();

        this.parent = null;
        this.children = [];
    }

    Node.prototype.translate = function (x, y, z) {
        var translateVector = glmatrix.vec3.fromValues(x, y, z);
        glmatrix.mat4.translate(this.tMatrix, this.tMatrix, translateVector);
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

    return Node;

});



