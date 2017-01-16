/**
 * Created by ubufu on 11/8/2016.
 */

define('Cube',['Node'], function(Node) {

    var Cube = function (name, gl) {
        Node.call(this, name, gl);

        //this.setDrawable(true);

        //default cube, modified from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
        this.vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ];
        this.indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        this.textureCoords = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        this.texturePosition = null;
        this.texture = null;
        this.textureBuffer = null;
        this.program = null;
        this.projectionMat = null;
        this.modelViewMat = null;
        this.transMat = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.indexCount = 0;
        this.curtim = 0;
        this.vertexPosition = 0;
        this.imageSrc = "mvre/media/images/default.jpg";

        //create shaders
        this.VSHADER_SOURCE = "";

        // Fragment shader program
        this.FSHADER_SOURCE = "";
    };


    Cube.prototype = Object.create(Node.prototype);
    Cube.prototype.update = function () {
        Node.prototype.update.call(this);
    }

    Cube.prototype.build = function (gl) {

        //create shader program
        this.program = createProgram(gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);

        //initialize vertex buffer
        this.vertexBuffer = initBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vertexPosition = gl.getAttribLocation(this.program, 'a_Position');
        gl.vertexAttribPointer(this.vertexBuffer, 3, gl.FLOAT, false, 0, 0);

        //initialize index buffer
        //this.indexBuffer = initBuffer(gl);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        //this.indexCount = this.indices.length;

        //get positions for model, view, and translate matrices
        this.projectionMat = gl.getUniformLocation(this.program, "projectionMat");
        this.modelViewMat = gl.getUniformLocation(this.program, "modelViewMat");
        this.transMat = gl.getUniformLocation(this.program, "transMat");

        //initialize texture
        this.texture = initTexture(gl, this.imageSrc);
        this.textureBuffer = initBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
        this.texturePosition = gl.getAttribLocation(this.program, "t_coord");
        gl.enableVertexAttribArray(this.texturePosition);
        gl.vertexAttribPointer(this.texturePosition, 2, gl.FLOAT, false, 0, 0);
    }

    Cube.prototype.setImageSrc = function(source){
        this.imageSrc = source;
    }

    return Cube;
});
