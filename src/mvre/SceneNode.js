/**
 * Created by ubufu on 9/7/2016.
 */

define(['glmatrix', 'cuon'], function(glmatrix, cuon){

    return function SceneNode() {
        this.name = "";
        this.tMatrix = glmatrix.mat4.create();
        this.rMatrix = glmatrix.mat4.create();
        this.sMatrix = glmatrix.mat4.create();
        this.vertices = new Float32Array([0.0, 0.5, 0.0,  -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);
        this.parent = null;
        this.children = [];
        this.program = null;


        //create shaders
        this.VSHADER_SOURCE =
            'attribute vec4 a_Position;\n' +
            ' void main() {\n' +
            ' gl_Position = a_Position;\n' +
            '}\n';

        // Fragment shader program
        this.FSHADER_SOURCE =
            'void main() {\n' +
            '  gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n' + // Set the point color
            '}\n';


        SceneNode.prototype.translate = function (x, y, z) {
            var translateVector = glmatrix.vec3.fromValues(x, y, z);
            mat4.translate(this.tMatrix, this.tMatrix, translateVector);
        }

        SceneNode.prototype.rotate = function (axis, radians) {
            mat4.rotate(this.rMatrix, this.rMatrix, radians, axis);
        }

        SceneNode.prototype.scaleX = function (x) {
            mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(x, 0, 0))
        }

        SceneNode.prototype.scaleY = function (y) {
            mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(0, y, 0))
        }

        SceneNode.prototype.scaleZ = function (z) {
            mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(0, 0, z))
        }

        SceneNode.prototype.scale = function (x, y, z) {
            mat4.scale(this.sMatrix, this.sMatrix, vec3.fromValues(x, y, z))
        }

        SceneNode.prototype.getVShader = function () {
            return this.VSHADER_SOURCE;
        }

        SceneNode.prototype.getFshader = function () {
            return this.FSHADER_SOURCE;
        }

        SceneNode.prototype.isLeaf = function () {
            return this.children.length == 0;
        }

        SceneNode.prototype.build = function(gl){
            this.program = createProgram(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
            var vertexBuffer = initVertexBuffer(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
            var a_Position = gl.getAttribLocation(this.program, 'a_Position');
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);
        }

        SceneNode.prototype.render = function(gl, pMat, vMat, eyeParams) {

            /**
             * This is where actual rendering will take
             * place. The current idea is to have a copy
             * of the rendering program attached to each
             * scenenode, so that when we render, we use
             * that program and can render immediately
             * without performing an costly logic
             */



            if(!this.isLeaf()){
                for(i = 0; i < this.children.length; i++) {
                    this.children[i].render(gl, pMat, vMat, eyeParams);
                }
            }

            gl.useProgram(this.program);

            gl.clearColor(0.5, 0.0, 0.5, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);

        }
    };
});