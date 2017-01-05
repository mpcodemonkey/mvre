/**
 * Created by ubufu on 10/6/2016.
 */
define(['Environment', 'Skybox','glmatrix', 'Cube'], function(Environment, Skybox, glmatrix, Cube) {

    this.render = function (world, gl, pMat, vMat) {
        /**
         * This is where actual rendering will take
         * place. The current idea is to have a copy
         * of the rendering program attached to each
         * scenenode, so that when we render, we use
         * that program and can render immediately
         * without performing any costly logic
         **/

        var thingsToRender = world.getEnvironmentAsList();

        thingsToRender.forEach(function(renderable){
            if(renderable.isDrawable()){
                gl.useProgram(renderable.program);
                gl.frontFace(gl.CCW);

                gl.uniformMatrix4fv(renderable.projectionMat, false, pMat);
                gl.uniformMatrix4fv(renderable.modelViewMat, false, vMat);
                gl.uniformMatrix4fv(renderable.transMat, false, renderable.wMatrix);

                gl.bindBuffer(gl.ARRAY_BUFFER, renderable.vertexBuffer);
                gl.vertexAttribPointer(renderable.vertexPosition, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(renderable.vertexPosition);

                gl.bindBuffer(gl.ARRAY_BUFFER, renderable.textureBuffer);
                gl.vertexAttribPointer(renderable.texturePosition, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(renderable.texturePosition);

                //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, renderable.indexBuffer);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, renderable.texture);
                gl.uniform1i(gl.getUniformLocation(renderable.program, "uSampler"), 0);

                if(renderable instanceof Skybox){
                    gl.disable(gl.DEPTH_TEST);
                    gl.frontFace(gl.CW);
                    gl.drawElements(gl.TRIANGLES, renderable.indexCount, gl.UNSIGNED_SHORT, 0);
                    gl.enable(gl.DEPTH_TEST);
                    gl.frontFace(gl.CCW);
                }
                else{
                    //gl.drawElements(gl.TRIANGLES, renderable.indexCount, gl.UNSIGNED_SHORT, 0);
                    gl.drawArrays(gl.TRIANGLES, 0, renderable.vertices.length/3);
                }
            }
        });

    }
});
