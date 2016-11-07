/**
 * Created by ubufu on 9/20/2016.
 */
define(["scene", "glmatrix"],function (SceneNode, glmatrix){

    //globals(for demo only)
    var root = null;
    var child = null;
    var child2 = null;
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
                'in vec2 t_coord;',
                'uniform mat4 projectionMat;',
                'uniform mat4 modelViewMat;',
                'uniform mat4 transMat;',
                'out vec4 posBasedColor;',
                'out vec2 t_coords;',
                ' void main() {',
                'posBasedColor = modelViewMat * transMat * vec4(a_Position, 1.0);',
                ' gl_Position = projectionMat * posBasedColor;',
                't_coords = t_coord;',
                '}'
            ].join("\n");

        root.FSHADER_SOURCE =
            [
                '#version 300 es\n',
                'precision mediump float;',
                'in vec4 posBasedColor;',
                'in vec2 t_coords;',
                'uniform sampler2D uSampler;',
                'out vec4 outColor;',
                'void main() {',
                '  outColor = texture(uSampler, vec2(t_coords.s, t_coords.t));', // Set the point color
                '}'
            ].join("\n");

        root.build(gl);

        child = new SceneNode();
        child.name = "child";

        child.VSHADER_SOURCE = root.VSHADER_SOURCE;

        child.FSHADER_SOURCE = root.FSHADER_SOURCE;
        child.build(gl);
        child.setParent(root);

        child2 = new SceneNode();
        child2.name = "bill";
        child2.VSHADER_SOURCE = root.VSHADER_SOURCE;

        child2.FSHADER_SOURCE = root.FSHADER_SOURCE;
        child2.build(gl);
        child2.scale(.5,.5,.5);
        child2.setParent(child);


        return root;
    }


    this.update = function (){

/*
        glmatrix.mat4.identity(child2.tMatrix);
        child2.translate(Math.sin(-child2.curtim/90), Math.sin(-child2.curtim/90),Math.sin(-child2.curtim/90));
        child2.rotate(0.05, glmatrix.vec3.fromValues(1.0,1.0,1.0));
        child2.curtim++;

        glmatrix.mat4.identity(child.tMatrix);
        child.translate(Math.sin(-child.curtim/90),Math.sin(child.curtim/45),Math.cos(-child.curtim/90));
        child.curtim++;

        glmatrix.mat4.identity(root.tMatrix);
        root.translate(3*Math.sin(root.curtim/360),.2*Math.sin(root.curtim/45),3*Math.cos(root.curtim/360));
        root.curtim++;
*/
        glmatrix.mat4.identity(root.tMatrix);
        root.translate(0,0,-4);


        glmatrix.mat4.identity(child.tMatrix);
        child.translate(1.8*Math.sin(-child.curtim/90),Math.sin(child.curtim/45),1.8*Math.cos(-child.curtim/90));
        child.curtim++;

        glmatrix.mat4.identity(child2.tMatrix);
        child2.translate(0, 3*Math.sin(-child2.curtim/90) ,3*Math.cos(-child2.curtim/90));
        child2.rotate(0.05, glmatrix.vec3.fromValues(0.0,1.0,0.0));
        child2.curtim++;


    }
});
