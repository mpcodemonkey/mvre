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

        if (!node.isLeaf()) {
            for (i = 0; i < node.children.length; i++) {
                render(node.children[i], gl, pMat, vMat);
            }
        }

        glmatrix.mat4.mul(node.lMatrix, node.getParentTransform(), node.lMatrix);

        gl.useProgram(node.program);
        gl.frontFace(gl.CW);

        gl.uniformMatrix4fv(node.projectionMat, false, pMat);
        gl.uniformMatrix4fv(node.modelViewMat, false, vMat);
        gl.uniformMatrix4fv(node.transMat, false, node.lMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, node.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.indexBuffer);
        gl.enableVertexAttribArray(node.position);
        gl.vertexAttribPointer(node.vertexBuffer, 3, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, node.indexCount, gl.UNSIGNED_SHORT, 0);


    }
});
