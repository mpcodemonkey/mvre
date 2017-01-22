/**
 * Created by ubufu on 1/21/2017.
 *
 * HUD element, extended from https://github.com/toji/webvr.info/blob/master/samples/js/third-party/wglu/wglu-stats.js
 */

define('HUD',['Node', 'glmatrix'], function(Node, glmatrix) {

    var HUD = function (name) {
        Node.call(this, name);

        //define mesh vertex and fragment shaders
        this.components.MeshComponent.VShaderAttributes = [
            "in vec2 a_Position;",
        ].join("\n");

        this.components.MeshComponent.VShaderOutput = [
            ""
        ].join("\n");

        this.components.MeshComponent.VShaderMain = [
            "gl_Position = projectionMat * modelViewMat * vec4( a_Position, 0.0, 1.0 );"
        ].join("\n");

        this.components.MeshComponent.FShaderAttributes = [
            "uniform vec4 color;"
        ].join("\n");

        this.components.MeshComponent.FShaderOutput = [
            "out vec4 outColor;"
        ].join("\n");

        this.components.MeshComponent.FShaderMain = [
            "outColor = color;"
        ].join("\n");

        //add attribute to MeshComponent
        this.components.MeshComponent.segmentIndices = [];

        //text attributes
        this.colorUniform = null;
        this.width = 0.5;
        this.thickness = 0.25;
        this.kerning = 2.0; //letter spacing
        this.characters = {};
        this.text = "";

        // Hard coded because it doesn't change:
        // Scale by 0.075 in X and Y
        // Translate into upper left corner w/ z = 0.02
        this.textMatrix = new Float32Array([
            0.075, 0, 0, 0,
            0, 0.075, 0, 0,
            0, 0, 1, 0,
            -0.3625, 0.3625, 0.02, 1
        ]);


    }

    HUD.prototype = Object.create(Node.prototype);

    HUD.prototype.defineSegment = function(id, left, top, right, bottom) {
         var idx = this.components.MeshComponent.vertices.length / 2;
         this.components.MeshComponent.vertices.push(
             left, top,
             right, top,
             right, bottom,
             left, bottom);

         this.components.MeshComponent.segmentIndices[id] = [
             idx, idx + 2, idx + 1,
             idx, idx + 3, idx + 2];
    }

    HUD.prototype.defineCharacter = function(c, segments) {
         var character = {
             character: c,
             offset: this.components.MeshComponent.indices.length * 2,
             count: 0
         };

         for (var i = 0; i < segments.length; ++i) {
             var idx = segments[i];
             var segment = this.components.MeshComponent.segmentIndices[idx];
             character.count += segment.length;
             this.components.MeshComponent.indices.push.apply(this.components.MeshComponent.indices, segment);
         }
         this.characters[c] = character;

    }

    HUD.prototype.build = function(gl){
        //define segments on creation
        /* Segment layout is as follows:

         |-0-|
         3   4
         |-1-|
         5   6
         |-2-|

         */

        this.defineSegment(0, -1, 1, this.width, 1-this.thickness);
        this.defineSegment(1, -1, this.thickness*0.5, this.width, -this.thickness*0.5);
        this.defineSegment(2, -1, -1+this.thickness, this.width, -1);
        this.defineSegment(3, -1, 1, -1+this.thickness, -this.thickness*0.5);
        this.defineSegment(4, this.width-this.thickness, 1, this.width, -this.thickness*0.5);
        this.defineSegment(5, -1, this.thickness*0.5, -1+this.thickness, -1);
        this.defineSegment(6, this.width-this.thickness, this.thickness*0.5, this.width, -1);

        //M/W and T line
        this.defineSegment(7, -.375, 1, -.125, -1);
        //R test, complicated
        this.defineSegment(8, -.375, this.thickness*0.5, -.125, -0.5);
        this.defineSegment(9, -.125, -this.width, .125, -.75);
        this.defineSegment(10, .125, -1 + this.thickness, .5, -1);
        //K test
        this.defineSegment(11, -1, this.thickness*0.5, -0.25, -this.thickness*0.5);
        this.defineSegment(12, -.375, 0.375, -.125, .125);
        this.defineSegment(13, -.125, .625, .125, .375);
        this.defineSegment(14, .125, 0.875, .5, .625);

        //G test
        this.defineSegment(15, -0.5, this.thickness*0.5, this.width, -this.thickness*0.5);

        //V test
        this.defineSegment(16, -1, 1, -1+this.thickness, -this.thickness*0.25);
        this.defineSegment(17, -1+this.thickness, -this.thickness*0.25, -0.5, -0.875);
        this.defineSegment(18, -0.5, -0.75, 0, -1);
        this.defineSegment(19, 0, -this.thickness*0.25, 0.25, -0.875);
        this.defineSegment(20, this.width-this.thickness, 1, this.width, -this.thickness*0.25);

        //X test (mirrored K and R parts)
        this.defineSegment(21, -1, -1 + this.thickness, -.625, -1 );
        this.defineSegment(22, -.625, -0.5, -.375, -0.75);
        this.defineSegment(23, -.625, .625, -.375, .375);
        this.defineSegment(24, -1, 0.875, -.625, .625);

        //Z test
        this.defineSegment(25, -1, -0.5, -0.75, -0.75 );
        this.defineSegment(26, -0.75, -0.25, -0.5, -0.5 );
        this.defineSegment(27, -0.5, 0, -0.25, -0.25 );
        this.defineSegment(28, -0.25, 0.25, 0, 0 );
        this.defineSegment(29, 0, 0.5, 0.25, 0.25 );
        this.defineSegment(30, 0.25, 0.75, 0.5, 0.5 );

        this.defineCharacter("0", [0, 2, 3, 4, 5, 6]);
        this.defineCharacter("1", [4, 6]);
        this.defineCharacter("2", [0, 1, 2, 4, 5]);
        this.defineCharacter("3", [0, 1, 2, 4, 6]);
        this.defineCharacter("4", [1, 3, 4, 6]);
        this.defineCharacter("5", [0, 1, 2, 3, 6]);
        this.defineCharacter("6", [0, 1, 2, 3, 5, 6]);
        this.defineCharacter("7", [0, 4, 6]);
        this.defineCharacter("8", [0, 1, 2, 3, 4, 5, 6]);
        this.defineCharacter("9", [0, 1, 2, 3, 4, 6]);
        this.defineCharacter("A", [0, 1, 3, 4, 5, 6]);
        this.defineCharacter("B", [1, 2, 3, 5, 6]);
        this.defineCharacter("C", [0, 2, 3, 5]);
        this.defineCharacter("D", [1, 2, 4, 5, 6]);
        this.defineCharacter("E", [0, 1, 2, 3, 5]);
        this.defineCharacter("F", [0, 1, 3, 5]);
        this.defineCharacter("G", [0, 2, 3, 5, 6, 15]);
        this.defineCharacter("H", [1, 3, 4, 5, 6]);
        this.defineCharacter("I", [0, 2, 7]);
        this.defineCharacter("J", [2, 4, 5, 6]);
        this.defineCharacter("K", [3, 5, 8, 9, 10, 11, 12, 13, 14]);
        this.defineCharacter("L", [2, 3, 5]);
        this.defineCharacter("M", [0, 3, 4, 5, 6, 7]);
        this.defineCharacter("N", [0, 3, 4, 5, 6]);
        this.defineCharacter("O", [0, 2, 3, 4, 5, 6]);
        this.defineCharacter("P", [0, 1, 3, 4, 5]);
        this.defineCharacter("Q", [0, 2, 3, 4, 5, 6, 8, 9]);
        this.defineCharacter("R", [0, 1, 3, 4, 5, 8, 9, 10]);
        this.defineCharacter("S", [0, 1, 2, 3, 6]);//redundant but needed
        this.defineCharacter("T", [0, 7]);
        this.defineCharacter("U", [2, 3, 4, 5, 6]);
        this.defineCharacter("V", [16, 17, 18, 19, 20]);
        this.defineCharacter("W", [2, 3, 4, 5, 6, 7]);
        this.defineCharacter("X", [8, 9, 10, 12, 13, 14, 21, 22, 23, 24]);
        this.defineCharacter("Y", [1, 2, 3, 4, 6]);
        this.defineCharacter("Z", [0,2, 25, 26, 27, 28, 29, 30]);
        this.defineCharacter("-", [1]);
        this.defineCharacter(" ", []);
        this.defineCharacter("_", [2]); // Used for undefined characters



        this.components.MeshComponent.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.components.MeshComponent.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.components.MeshComponent.vertices), gl.DYNAMIC_DRAW);

        this.components.MeshComponent.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.components.MeshComponent.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.components.MeshComponent.indices), gl.STATIC_DRAW);

        this.program = createProgramFromComponents(this, gl);

        this.vertexPosition = gl.getAttribLocation(this.program, 'a_Position');
        gl.vertexAttribPointer(this.vertexPosition, 2, gl.FLOAT, false, 8, 0);

        //get positions for model, view, and color matrices
        this.projectionMat = gl.getUniformLocation(this.program, "projectionMat");
        this.modelViewMat = gl.getUniformLocation(this.program, "modelViewMat");
        this.colorUniform = gl.getUniformLocation(this.program, "color");

        this.setDrawable(true);
    }

    HUD.prototype.render = function(gl){



        var matrix = new Float32Array(16);
        var final = glmatrix.mat4.create();
        var r = 1.0;
        var g = 1.0;
        var b = 0.0;
        var a = 1.0;

        glmatrix.mat4.fromTranslation(this.tMatrix, [-0.5, -0.3, -0.5]);
        glmatrix.mat4.scale(this.tMatrix, this.tMatrix, [0.2, 0.2, 0.2]);
        glmatrix.mat4.rotateX(this.tMatrix, this.tMatrix, 0.0);
        glmatrix.mat4.multiply(this.tMatrix, gl.viewMatrix, this.tMatrix);
        glmatrix.mat4.multiply(matrix, this.tMatrix, this.textMatrix);

        gl.uniform4f(this.colorUniform, r, g, b, a);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.components.MeshComponent.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.components.MeshComponent.indexBuffer);

        gl.enableVertexAttribArray(this.vertexPosition);
        gl.vertexAttribPointer(this.vertexPosition, 2, gl.FLOAT, false, 8, 0);

        var offset = 0;

        for (var i = 0; i < this.text.length; ++i) {
            var c;
            if (this.text[i] in this.characters) {
                c = this.characters[this.text[i]];
            } else {
                c = this.characters["_"];
            }

            if (c.count != 0) {
                glmatrix.mat4.fromTranslation(final, [offset, 0, 0]);
                glmatrix.mat4.multiply(final, matrix, final);

                gl.uniformMatrix4fv(this.modelViewMat, false, final);
                gl.drawElements(gl.TRIANGLES, c.count, gl.UNSIGNED_SHORT, c.offset);

            }

            offset += this.kerning;
        }
    }

    HUD.prototype.setText = function(words){
        this.text = words;
    }

    HUD.prototype.update = function () {
        Node.prototype.update.call(this);
    }


    return HUD;
});
