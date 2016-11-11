/**
 * Created by ubufu on 11/10/2016.
 */

/**
 * This will be a test of how deferred rendering will work in webgl. I'm
 * not going to worry about the lack of transparency support at the moment.
 * The performance increase with lighting sources is well worth the risk
 * of losing support for transparency.
 **/

define('DeferredRenderer',['BaseRenderer', 'glmatrix'], function(BaseRenderer, glmatrix) {

    var DeferredRenderer = function(gl, width, height){
        BaseRenderer.call(this, gl, width, height);

        //create and bind new frame buffer
        this.geometryBuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.geometryBuffer);
        // - Position color buffer
        this.positionTexture = this.gl.createTexture();
        this.depthTexture = this.gl.createTexture();
        this.depthRGBTexture = this.gl.createTexture();

        //set up depth texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT16, this.width, this.height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);

        //set up position texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.positionTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_SHORT_5_5_5_1, null);

        //set up the depth rgb texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthRGBTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_SHORT_5_5_5_1, null);

        //todo: change this to an array of attachments(0..2) when lighting is implemented
        this.gl.drawBuffers([this.gl.NONE, this.gl.COLOR_ATTACHMENT1, this.gl.COLOR_ATTACHMENT2]);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT1, this.gl.TEXTURE_2D, this.depthRGBTexture, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT2, this.gl.TEXTURE_2D, this.positionTexture, 0);

        var FBOstatus = this.gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(FBOstatus != this.gl.FRAMEBUFFER_COMPLETE) {
            console.log("GL_FRAMEBUFFER_COMPLETE failed, CANNOT use new framebuffer :(\n");
        }

        this.gl.clearColor(0.1, 0.2, 0.3, 1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);


    };

    DeferredRenderer.prototype = Object.create(BaseRenderer.prototype);

    DeferredRenderer.prototype.render = function(node, pMat, vMat){
        /**
         * for now, I will only implement the first pass, since
         * I currently have no lighting or shadow mapping implemented
         * yet.
         */

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        //1. Geometry pass. Renders objects with their textures to G-buffer
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.geometryBuffer);
        // use shader program for geometry, then continue
        // set up uniforms for projection and view matrices

        this.gl.useProgram(node.program);
        this.gl.frontFace(this.gl.CCW);

        this.gl.uniformMatrix4fv(node.projectionMat, false, pMat);
        this.gl.uniformMatrix4fv(node.modelViewMat, false, vMat);
        this.gl.uniformMatrix4fv(node.transMat, false, node.wMatrix);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.vertexBuffer);
        this.gl.vertexAttribPointer(node.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(node.vertexPosition);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, node.textureBuffer);
        this.gl.vertexAttribPointer(node.texturePosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(node.texturePosition);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, node.indexBuffer);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, node.texture);
        this.gl.uniform1i(this.gl.getUniformLocation(node.program, "uSampler"), 0);

        this.gl.drawElements(this.gl.TRIANGLES, node.indexCount, this.gl.UNSIGNED_SHORT, 0);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    }

    return DeferredRenderer;
});