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
        this.wMatrix = glmatrix.mat4.create();

        //default cube, modified from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
        this.vertices = [
            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        this.indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        this.textureCoords = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ];
        this.texturePosition = null;
        this.texture = null;
        this.textureBuffer = null;
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
        this.vertexPosition = 0;


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
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, glmatrix.vec3.fromValues(x, 0, 0))
        }

        SceneNode.prototype.scaleY = function (y) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, glmatrix.vec3.fromValues(0, y, 0))
        }

        SceneNode.prototype.scaleZ = function (z) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, glmatrix.vec3.fromValues(0, 0, z))
        }

        SceneNode.prototype.scale = function (x, y, z) {
            glmatrix.mat4.scale(this.sMatrix, this.sMatrix, glmatrix.vec3.fromValues(x, y, z))
        }

        SceneNode.prototype.computeLocalMatrix = function(){
            var tmp = glmatrix.mat4.create();
            glmatrix.mat4.mul(tmp, this.rMatrix, this.sMatrix);
            glmatrix.mat4.mul(this.lMatrix, this.tMatrix, tmp);
        }

        SceneNode.prototype.isLeaf = function () {
            return this.children.length == 0;
        }

        //from http://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html
        //modified for use with glmatrix
        SceneNode.prototype.updateWorldMatrix = function(parent) {
            if (parent) {
                // parent exists, update world matrix with
                // parent world matrix
                glmatrix.mat4.mul(this.wMatrix, parent.wMatrix, this.lMatrix);
            } else {
                // no matrix was passed in so just copy lMatrix to wMatrix
                glmatrix.mat4.copy(this.wMatrix, this.lMatrix);
            }

            // now process all the children
            var worldMatrix = this.worldMatrix;
            this.children.forEach(function(child) {
                child.updateWorldMatrix(worldMatrix);
            });
        };

        //from http://webglfundamentals.org/webgl/lessons/webgl-scene-graph.html
        //proper way to set parent/child node relationship without multi-parenting
        SceneNode.prototype.setParent = function(parent){
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

        SceneNode.prototype.build = function(gl){

            //create shader program
            this.program = createProgram(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);

            //initialize vertex buffer
            this.vertexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            this.vertexPosition = gl.getAttribLocation(this.program, 'a_Position');
            gl.vertexAttribPointer(this.vertexBuffer, 3, gl.FLOAT, false, 0, 0);

            //initialize index buffer
            this.indexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            this.indexCount = this.indices.length;

            //get positions for model, view, and translate matrices
            this.projectionMat = gl.getUniformLocation(this.program, "projectionMat");
            this.modelViewMat = gl.getUniformLocation(this.program, "modelViewMat");
            this.transMat = gl.getUniformLocation(this.program, "transMat");

            //initialize texture
            this.texture = initTexture(gl, "mvre/media/images/default.jpg");
            this.textureBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
            this.texturePosition = gl.getAttribLocation(this.program, "t_coord");
            gl.enableVertexAttribArray(this.texturePosition);
            gl.vertexAttribPointer(this.texturePosition, 2, gl.FLOAT, false, 0, 0);
        }
    };
});