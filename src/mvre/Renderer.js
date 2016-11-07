/**
 * Created by ubufu on 10/6/2016.
 */
define(['glmatrix', 'scene'], function(glmatrix, scene) {

    this.render = function (node, gl, pMat, vMat) {
        /**
         * This is where actual rendering will take
         * place. The current idea is to have a copy
         * of the rendering program attached to each
         * scenenode, so that when we render, we use
         * that program and can render immediately
         * without performing any costly logic
         **/


        //compute the local transform matrix of the given node
        node.computeLocalMatrix();

        //compute the global matrix
        node.updateWorldMatrix(node.parent);

        if (!node.isLeaf()) {
            for (i = 0; i < node.children.length; i++) {
                render(node.children[i], gl, pMat, vMat);
            }
        }

        gl.useProgram(node.program);
        gl.frontFace(gl.CCW);

        gl.uniformMatrix4fv(node.projectionMat, false, pMat);
        gl.uniformMatrix4fv(node.modelViewMat, false, vMat);
        gl.uniformMatrix4fv(node.transMat, false, node.wMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, node.vertexBuffer);
        gl.enableVertexAttribArray(node.vertexPosition);
        gl.vertexAttribPointer(node.vertexBuffer, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, node.textureBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, node.texture);
        gl.uniform1i(gl.getUniformLocation(node.program, "uSampler"), 0);

        gl.drawElements(gl.TRIANGLES, node.indexCount, gl.UNSIGNED_SHORT, 0);


    }
});
