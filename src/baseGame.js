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

        system = new Node();
        system.name = "system";
        system.translate(0,0,-4);

        skybox = new Skybox();
        skybox.name = "bawks";
        skybox.setImageSrc("mvre/media/images/bucklebox.jpg");
        skybox.VSHADER_SOURCE = prototype_vshader;
        skybox.FSHADER_SOURCE = prototype_fshader;
        skybox.build(gl);
        skybox.setParent(system);
        skybox.translate(0,0,4);
        skybox.scale(2,2,2);

        sunRotator = new RotationController();
        sunRotator.name = "sunRot";
        sunRotator.setParent(system);

        sun = new Cube();
        sun.name = "sun";
        sun.VSHADER_SOURCE = prototype_vshader;
        sun.FSHADER_SOURCE = prototype_fshader;
        sun.setImageSrc("mvre/media/images/chang.jpg");
        sun.build(gl);
        sun.setParent(sunRotator);

        earthController = new RotationController();
        earthController.name = "childController";
        earthController.setDefaultRotationRate(.005);
        earthController.setParent(system);

        earthGroup = new Node();
        earthGroup.name = "Earth Group";
        earthGroup.setParent(earthController);
        earthGroup.translate(4,0,0);

        earth = new Cube();
        earth.name = "child";
        earth.VSHADER_SOURCE = sun.VSHADER_SOURCE;
        earth.FSHADER_SOURCE = sun.FSHADER_SOURCE;
        earth.build(gl);
        earth.setParent(earthGroup);
        earth.scale(0.7,0.7,0.7);

        moon = new Cube();
        moon.name = "bill";
        moon.VSHADER_SOURCE = sun.VSHADER_SOURCE;

        moon.FSHADER_SOURCE = sun.FSHADER_SOURCE;
        moon.setImageSrc("mvre/media/images/krovetz.jpg")
        moon.build(gl);
        moon.scale(.3,.3,.3);
        moon.setParent(earthGroup);

        return system;
    }


    this.update = function (){

        glmatrix.mat4.identity(moon.tMatrix);
        moon.translate(0, 3*Math.sin(-moon.curtim/90) ,3*Math.cos(-moon.curtim/90));
        moon.rotate(0.05, glmatrix.vec3.fromValues(1.0,0.0,0.0));
        moon.curtim++;

    }
});