/**
 * Created by ubufu on 2/21/2017.
 */

/**
 * Created by ubufu on 11/8/2016.
 */

define('IFR',['Node', 'glmatrix'], function(Node, glmatrix){

    var IFR = function(name){
        Node.call(this, name);

        this.components.MeshComponent.vertices = [
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
        this.components.MeshComponent.indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        this.components.MeshComponent.indexCount = this.components.MeshComponent.indices.length;
    }

    IFR.prototype = Object.create(Node.prototype);

    IFR.prototype.render = function(gl){
        var vRotMatrix = glmatrix.mat4.create();
        glmatrix.mat4.invert(vRotMatrix, gl.viewMatrix);
        this.tMatrix = vRotMatrix;
        this.translate(0,0,-10);

        //this.setDrawable(false)
        //gl.drawElements(gl.TRIANGLES, this.components.MeshComponent.indexCount, gl.UNSIGNED_SHORT, 0);
    }

    return IFR;

});



