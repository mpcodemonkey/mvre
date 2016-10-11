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


        //create shaders
        this.VSHADER_SOURCE =
            [
            '#version 300 es\n',
            'precision mediump float;',
            'in vec3 a_Position;',
            'uniform mat4 projectionMat;',
            'uniform mat4 modelViewMat;',
            'uniform mat4 transMat;',
            'out vec4 posBasedColor;',
            ' void main() {',
            'posBasedColor = vec4(a_Position, 1.0);',
            ' gl_Position = projectionMat * modelViewMat * transMat * vec4(a_Position, 1.0);',
            '}'
            ].join("\n");

        // Fragment shader program
        this.FSHADER_SOURCE =
            [
            '#version 300 es\n',
            'precision mediump float;',
            'in vec4 posBasedColor;',
            'out vec4 outColor;',
            'void main() {',
            '  outColor = posBasedColor;', // Set the point color
            '}'
            ].join("\n");


        SceneNode.prototype.translate = function (x, y, z) {
            var translateVector = glmatrix.vec3.fromValues(x, y, z);
            glmatrix.mat4.translate(this.tMatrix, this.tMatrix, translateVector);
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
            var vertexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
            var a_Position = gl.getAttribLocation(this.program, 'a_Position');
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);

            var indexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

            this.projectionMat = gl.getUniformLocation(this.program, "projectionMat");
            this.modelViewMat = gl.getUniformLocation(this.program, "modelViewMat");
            this.transMat = gl.getUniformLocation(this.program, "transMat");

            //this.translate(1.0,0.0,-1.0);
        }

        SceneNode.prototype.render = function(gl, pMat, vMat) {

            /**
             * This is where actual rendering will take
             * place. The current idea is to have a copy
             * of the rendering program attached to each
             * scenenode, so that when we render, we use
             * that program and can render immediately
             * without performing any costly logic
             */



            if(!this.isLeaf()){
                for(i = 0; i < this.children.length; i++) {
                    this.children[i].render(gl, pMat, vMat);
                }
            }

            gl.useProgram(this.program);
            //gl.frontFace(gl.CW);

            gl.uniformMatrix4fv(this.projectionMat, false, pMat);
            gl.uniformMatrix4fv(this.modelViewMat, false, vMat);
            gl.uniformMatrix4fv(this.transMat, false, this.tMatrix);


            gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);
            //gl.drawArrays(gl.POINTS, 0, 1);
        }
    };
});