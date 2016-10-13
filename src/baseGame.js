/**
 * Created by ubufu on 9/20/2016.
 */
define(["scene"],function (SceneNode){

    /**
     * This is where the initial Scenegraph and all control logic
     * for a given application must be written.
     * @param gl
     */
    this.init = function(gl){
        var root = new SceneNode();
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

        return root;
    }


    this.update = function (){

    }
});
