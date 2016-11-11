/**
 * Created by ubufu on 9/20/2016.
 */
define(["Skybox", "Shaders", "Node", "Cube", "glmatrix", "TranslationController", "RotationController"],function (Skybox, Shaders, Node, Cube, glmatrix, TranslationController, RotationController){

    //globals(for demo only)
    var skybox
    var system = null;
    var sunRotator;
    var sun = null;
    var earthController = null;
    var earth = null;
    var earthGroup = null;
    var child2Controller = null;
    var moon = null;
    /**
     * This is where the initial Scenegraph and all control logic
     * for a given application must be written.
     * @param gl
     */
    this.init = function(gl){

        sun = new Cube();
        sun.name = "sun"
        sun.setImageSrc("mvre/media/images/bucklebox.jpg");
        sun.VSHADER_SOURCE = prototype_vshader;
        sun.FSHADER_SOURCE = prototype_fshader;
        sun.build(gl);
        sun.translate(0,0,-2);
        return sun;
    }


    this.update = function (){

        sun.translate(2 * Math.sin(sun.curtim), 4 * Math.sin(sun.curtim), 0);
        sun.curtim++;
    }
});