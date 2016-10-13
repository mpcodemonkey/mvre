/**
 * Created by ubufu on 9/20/2016.
 */
define(["scene", "glmatrix"],function (SceneNode, glmatrix){

    //globals(for demo only)
    var root = null;
    var child = null;
    /**
     * This is where the initial Scenegraph and all control logic
     * for a given application must be written.
     * @param gl
     */
    this.init = function(gl){
        root = new SceneNode();
        root.name = "root";

        root.VSHADER_SOURCE =
            [
                '#version 300 es\n',
                'precision mediump float;',
                'in vec3 a_Position;',
                'uniform mat4 projectionMat;',
                'uniform mat4 modelViewMat;',
                'uniform mat4 transMat;',
                'out vec4 posBasedColor;',
                ' void main() {',
                'posBasedColor = modelViewMat * transMat * vec4(a_Position, 1.0);',
                ' gl_Position = projectionMat * posBasedColor;',
                '}'
            ].join("\n");

        root.FSHADER_SOURCE =
            [
                '#version 300 es\n',
                'precision mediump float;',
                'in vec4 posBasedColor;',
                'out vec4 outColor;',
                'void main() {',
                '  outColor = vec4(posBasedColor.x, posBasedColor.y, posBasedColor.z, 1.0);', // Set the point color
                '}'
            ].join("\n");

        root.build(gl);

        child = new SceneNode();
        child.name = "child";

        child.VSHADER_SOURCE = root.VSHADER_SOURCE;

        child.FSHADER_SOURCE = root.FSHADER_SOURCE;
        child.build(gl);
        child.parent = root;

        root.children.push(child);

        return root;
    }


    this.update = function (){



        glmatrix.mat4.identity(child.tMatrix);
        glmatrix.mat4.identity(child.sMatrix);
        child.translate(Math.sin(-child.curtim/90),Math.sin(child.curtim/45),Math.cos(-child.curtim/90));
        child.rotate(0.05, glmatrix.vec3.fromValues(0.0,1.0,0.0));
        child.curtim++;

        glmatrix.mat4.identity(root.tMatrix);
        root.translate(3*Math.sin(root.curtim/360),.2*Math.sin(root.curtim/45),3*Math.cos(root.curtim/360));
        root.curtim++;

    }
});
