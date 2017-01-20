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

                //temp: set up texture
                Object.values(renderable.components).forEach(function(component){
                    component.apply(gl, renderable);
                })


                if(renderable instanceof Skybox){
                    gl.disable(gl.DEPTH_TEST);
                    gl.frontFace(gl.CW);
                    gl.drawElements(gl.TRIANGLES, renderable.indexCount, gl.UNSIGNED_SHORT, 0);
                    gl.enable(gl.DEPTH_TEST);
                    gl.frontFace(gl.CCW);
                }
                else{
                    //gl.drawElements(gl.TRIANGLES, renderable.components.MeshComponent.indexCount, gl.UNSIGNED_SHORT, 0);
                    gl.drawArrays(gl.TRIANGLES, 0, renderable.components.MeshComponent.vertices.length/3);
                }
            }
        });

    }
});
