// cuon-utils.js (c) 2012 kanda and matsuda
// modified by Jonathan Tinney to include extra helper functions provided in the WebGl programming guide


//create a texture array, will need for optimization
var texArray = [];
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initBuffer(gl) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object ');
    return -1;
  }
  return buffer;
}

function initTexture(gl, imgSrc){
  if(texArray[imgSrc] !== undefined){
    return texArray[imgSrc];
  }
  var preparedTexture = gl.createTexture();
  /**
   * this is a fix for textures not loading immediately at runtime. Basically,
   * a placeholder 1x1 texture is created as a stand-in until the proper texture
   * is loaded. From http://stackoverflow.com/questions/19722247/webgl-wait-for-texture-to-load/19748905#19748905
   * This removes the "not a power of 2" error on power of 2 textures
   */
  gl.bindTexture(gl.TEXTURE_2D, preparedTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 0, 255])); // red
  preparedTexture.image = new Image();
  preparedTexture.image.onload = function() { handleTextureLoaded(gl, preparedTexture); }
  preparedTexture.image.src = imgSrc;

  texArray[imgSrc] = preparedTexture;
  return preparedTexture;
}

function handleTextureLoaded(gl, texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE  , texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function createProgramFromComponents(node, gl){
  var vertexShader = null;
  var fragmentShader = null;

  var compare = node.VSHADER_SOURCE;

  //start with vertex shader
  vertexShader = [
        "#version 300 es",
        "",
        "precision mediump float;",
    ].join("\n");

    Object.values(node.components).forEach(function(component){
        vertexShader += "\n" + component.VShaderAttributes + "\n";
    })

    //create uniforms
    vertexShader += [
        "uniform mat4 projectionMat;",
        "uniform mat4 modelViewMat;",
        "uniform mat4 transMat;"
    ].join("\n");

    Object.values(node.components).forEach(function(component){
        vertexShader += "\n" + component.VShaderOutput + "\n";
    })

    vertexShader += [
        "void main() {"
    ].join("\n");

    Object.values(node.components).forEach(function(component){
        vertexShader += "\n" + component.VShaderMain + "\n";
    })

    vertexShader += [
        "}"
    ].join("\n");

    //fragment shader next
    fragmentShader = [
        "#version 300 es",
        "",
        "precision mediump float;",
    ].join("\n");

    Object.values(node.components).forEach(function(component){
        fragmentShader += "\n" + component.FShaderAttributes + "\n";
    })

    //create uniforms
    fragmentShader += [
        "uniform mat4 projectionMat;",
        "uniform mat4 modelViewMat;",
        "uniform mat4 transMat;"
    ].join("\n");

    Object.values(node.components).forEach(function(component){
        fragmentShader += "\n" + component.FShaderOutput + "\n";
    })

    fragmentShader += [
        "void main() {"
    ].join("\n");

    Object.values(node.components).forEach(function(component){
        fragmentShader += "\n" + component.FShaderMain + "\n";
    })

    fragmentShader += [
        "}"
    ].join("\n");

    //now create shaders as you normally would
    var program = createProgram(gl, vertexShader, fragmentShader);

    return program;
}


