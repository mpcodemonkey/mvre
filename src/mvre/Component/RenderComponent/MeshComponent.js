/**
 * Created by ubufu on 1/18/2017.
 */

define('MeshComponent', [], function(){

    //all mesh information used by drawn nodes
    //currently implemented:
    //vertices: O
    //indices: O
    //texCoords: O
    //normals: X

    var MeshComponent = function(){
        this.vertices = [],
        this.indices = [],
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertexPosition = null;
        this.indexCount = 0;

        this.VShaderAttributes = [
            "in vec3 a_Position;"
        ].join("\n");

        this.VShaderOutput = [
            ""
        ].join("\n");

        this.VShaderMain = [
            "gl_Position = projectionMat * modelViewMat * transMat * vec4(a_Position, 1.0);"
        ].join("\n");

        this.FShaderAttributes = [
            ""
        ].join("\n");

        this.FShaderOutput = [
            "out vec4 outColor;"
        ].join("\n");

        this.FShaderMain = [
            "outColor = vec4(1.0,0.0,0.0,1.0);"
        ].join("\n");
    };

    MeshComponent.prototype.name = 'MeshComponent';

    MeshComponent.prototype.build = function(gl, node){
        var program = node.program;
        //initialize vertex buffer
        this.vertexBuffer = initBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vertexPosition = gl.getAttribLocation(program, 'a_Position');
        gl.vertexAttribPointer(this.vertexBuffer, 3, gl.FLOAT, false, 0, 0);

        //if the object uses indices for drawing
        if(this.indices.length > 0){

            //initialize index buffer
            this.indexBuffer = initBuffer(gl);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            this.indexCount = this.indices.length;
        }
    }

    MeshComponent.prototype.apply = function(gl, program){
        //set up buffers for each draw
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertexPosition);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    return MeshComponent;

});