/**
 * Created by ubufu on 9/7/2016.
 */

define(['glmatrix', 'cuon'], function(glmatrix, cuon){
//todo: refactor render code in separate renderer.js file
    return function SceneNode() {
        this.name = "";
        this.tMatrix = glmatrix.mat4.create();
        this.rMatrix = glmatrix.mat4.create();
        this.sMatrix = glmatrix.mat4.create();
        this.lMatrix = glmatrix.mat4.create();
        this.vertices = new Float32Array([
            -0.5, -0.5, -0.5, // 0. left-back
            0.5, -0.5, -0.5, // 1. right-back
            0.5, -0.5, 0.5, // 2. right-front
            -0.5, -0.5, 0.5, // 3. left-front
            0.0, 0.5, 0.0, // 4. top
            ]);
        this.indices = [4,2,3, 4,1,2, 4,3,0, 4,0,1, 0,3,1, 3,2,1];
        this.parent = null;
        this.children = [];
        this.program = null;
        this.projectionMat = null;
        this.modelViewMat = null;
        this.transMat = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.indexCount = 0;
        this.curtim = 0;


        //create shaders
        this.VSHADER_SOURCE = "";

        // Fragment shader program
        this.FSHADER_SOURCE = "";


        SceneNode.prototype.translate = function (x, y, z) {
            var translateVector = glmatrix.vec3.fromValues(x, y, z);
            glmatrix.mat4.translate(this.tMatrix, this.tMatrix, translateVector);
        }

        SceneNode.prototype.rotate = function (radians, axis) {
            glmatrix.mat4.rotate(this.rMatrix, this.rMatrix, radians, axis);
        }

        SceneNode.prototype.scaleX = function (x) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(x, 0, 0))
        }

        SceneNode.prototype.scaleY = function (y) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(0, y, 0))
        }

        SceneNode.prototype.scaleZ = function (z) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(0, 0, z))
        }

        SceneNode.prototype.scale = function (x, y, z) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(x, y, z))
        }

        SceneNode.prototype.computeLocalMatrix = function(){
            var tmp = glmatrix.mat4.create();
            glmatrix.mat4.mul(tmp, this.rMatrix, this.tMatrix);
            glmatrix.mat4.mul(this.lMatrix, this.sMatrix, tmp);
        }

        SceneNode.prototype.getParentTransform = function(){
            return this.parent === null ? glmatrix.mat4.create() : this.parent.lMatrix;
        }

        SceneNode.prototype.isLeaf = function () {
            return this.children.length == 0;
        }

        SceneNode.prototype.build = function(gl){
            this.program = createProgram(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
            this.vertexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
            this.position = gl.getAttribLocation(this.program, 'a_Position');
            gl.vertexAttribPointer(this.vertexBuffer, 3, gl.FLOAT, false, 0, 0);

            this.indexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

            this.projectionMat = gl.getUniformLocation(this.program, "projectionMat");
            this.modelViewMat = gl.getUniformLocation(this.program, "modelViewMat");
            this.transMat = gl.getUniformLocation(this.program, "transMat");

            this.indexCount = this.indices.length;
        }
    };
});