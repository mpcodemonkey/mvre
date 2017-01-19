/**
 * Created by ubufu on 11/14/2016.
 */
/**
 * Created by ubufu on 9/20/2016.
 */
define('Game', ["BaseGame", "Environment", "Skybox", "Shaders", "Node", "Cube", "glmatrix", "TranslationController", "RotationController", "ModelLoader"],
    function (
    BaseGame,
    Environment,
    Skybox,
    Shaders,
    Node,
    Cube,
    glmatrix,
    TranslationController,
    RotationController,
    ModelLoader){

    var Game = function(Environment){
        BaseGame.call(this, Environment);
    }

    Game.prototype = Object.create(BaseGame.prototype);


    /**
     * All variable declarations should occur here for
     * global values that will be used throughout the
     * game.
     */

    var skybox = null
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
    Game.prototype.init = function(gl, world){

        /*
        system = new Node();
        system.name = "system";
        system.translate(0,0,-4);
        this.environment.addNode(system);

        skybox = new Skybox();
        skybox.name = "bawks";
        skybox.setImageSrc("mvre/media/images/default.jpg");
        skybox.VSHADER_SOURCE = prototype_vshader;
        skybox.FSHADER_SOURCE = prototype_fshader;
        skybox.build(gl);
        skybox.setParent(system);
        skybox.translate(0,0,4);
        skybox.scale(2,2,2);
        this.environment.addNode(skybox);

        sunRotator = new RotationController();
        sunRotator.name = "sunRot";
        sunRotator.setParent(system);
        this.environment.addNode(sunRotator);

        sun = new Cube();
        sun.name = "sun";
        sun.VSHADER_SOURCE = prototype_vshader;
        sun.FSHADER_SOURCE = prototype_fshader;
        sun.setImageSrc("mvre/media/images/default.jpg");
        sun.build(gl);
        sun.setParent(sunRotator);
        this.environment.addNode(sun);

        earthController = new RotationController();
        earthController.name = "childController";
        earthController.setDefaultRotationRate(.005);
        earthController.setParent(system);
        this.environment.addNode(earthController);

        earthGroup = new Node();
        earthGroup.name = "Earth Group";
        earthGroup.setParent(earthController);
        earthGroup.translate(4,0,0);
        this.environment.addNode(earthGroup);

        earth = new Cube();
        earth.name = "child";
        earth.VSHADER_SOURCE = sun.VSHADER_SOURCE;
        earth.FSHADER_SOURCE = sun.FSHADER_SOURCE;
        earth.build(gl);
        earth.setParent(earthGroup);
        earth.scale(0.7,0.7,0.7);
        this.environment.addNode(earth);

        moon = new Cube();
        moon.name = "bill";
        moon.VSHADER_SOURCE = sun.VSHADER_SOURCE;

        moon.FSHADER_SOURCE = sun.FSHADER_SOURCE;
        moon.setImageSrc("mvre/media/images/default.jpg")
        moon.build(gl);
        moon.scale(.3,.3,.3);
        moon.setParent(earthGroup);
        this.environment.addNode(moon);
        */



        system = new Node("system");
        system.name = "system";
        system.VSHADER_SOURCE = prototype_vshader;
        system.FSHADER_SOURCE = prototype_fshader;
        system.setImageSrc("mvre/media/images/gemUV_color.jpg");
        var  m = new ModelLoader();
        m.loadModel(gl, system, "mvre/models/gem_test.obj");
        system.translate(0,0,-4);
        this.environment.addNode(system);
        return system;
    }


    Game.prototype.update = function (delta){

        //glmatrix.mat4.identity(moon.tMatrix);
        //moon.translate(0, 3*Math.sin(-moon.curtim/90) ,3*Math.cos(-moon.curtim/90));
        system.rotate(0.05, glmatrix.vec3.fromValues(1.0,1.0,1.0));
        //moon.curtim++;


    }

    return Game;
});