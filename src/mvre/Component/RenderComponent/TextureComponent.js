/**
 * Created by ubufu on 1/19/2017.
 */

define('TextureComponent', [], function(){

    //all mesh information used by drawn nodes
    //currently implemented:
    //texCoords: O

    var TextureComponent = function(){
        this.textureCoords = [],
        this.texturePosition = null,
        this.texture = null,
        this.textureBuffer = null,
        //set default texture if none is supplied
        this.imageSrc = "mvre/media/images/default.jpg";

        //shader source
        this.VShaderAttributes = [
            "in vec2 t_coord;"
        ].join("\n");

        this.VShaderOutput = [
            "out vec2 t_coords;"
        ].join("\n");

        this.VShaderMain = [
            "t_coords = t_coord;"
        ].join("\n");

        this.FShaderAttributes = [
            "in vec2 t_coords;",
            "uniform sampler2D uSampler;"
        ].join("\n");

        this.FShaderOutput = [
            ""
        ].join("\n");

        this.FShaderMain = [
            "outColor = texture(uSampler, vec2(t_coords.s, t_coords.t)); // Set the point color"
        ].join("\n");
    };

    TextureComponent.prototype.name = 'TextureComponent';

    TextureComponent.prototype.build = function(gl, node){
        var program = node.program;
        //initialize texture
        this.texture = initTexture(gl, this.imageSrc);
        this.textureBuffer = initBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
        this.texturePosition = gl.getAttribLocation(program, "t_coord");
        gl.enableVertexAttribArray(this.texturePosition);
        gl.vertexAttribPointer(this.texturePosition, 2, gl.FLOAT, false, 0, 0);
    }

    TextureComponent.prototype.apply = function(gl, program){
        //set up buffers for each draw
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(this.texturePosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.texturePosition);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);
    }
    return TextureComponent;

});