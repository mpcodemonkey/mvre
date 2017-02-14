/**
 * Created by ubufu on 11/14/2016.
 */
/**
 * Created by ubufu on 9/20/2016.
 */
define('Game', ["BaseGame", "Environment", "Skybox", "Shaders", "Node", "Cube", "glmatrix", "TranslationController", "RotationController", "ModelLoader", "HUD", 'TextureComponent', 'PhysicsComponent'],
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
    ModelLoader,
    HUD,
    TextureComponent,
    PhysicsComponent){

    var Game = function(Environment){
        BaseGame.call(this, Environment);
    }

    Game.prototype = Object.create(BaseGame.prototype);


    /**
     * All variable declarations should occur here for
     * global values that will be used throughout the
     * game.
     */

    var system = null
    var hud = null;
    var gem = null;
    var floor = null;
    var time = 0;

    /**
     * This is where the initial Scenegraph and all control logic
     * for a given application must be written.
     * @param gl
     */
    Game.prototype.init = function(gl, world){

        system = new Node("system");
        system.setDrawable(false);
        this.environment.addNode(system);



        hud = new HUD("HUD");
        hud.setText("HEIGHT- 0M");
        //hud.setColor(0,1,0,1);
        hud.build(gl);
        hud.setParent(system);
        this.environment.addNode(hud);

        gem = new Node("gem");
        gem.components.TextureComponent = new TextureComponent("texture");
        gem.components.PhysicsComponent = new PhysicsComponent("physics");
        gem.components.PhysicsComponent.setCollisionResponse(true);
        gem.components.PhysicsComponent.setMass(.01);
        gem.components.PhysicsComponent.setBoundingType("sphere");
        gem.components.MeshComponent.setColor(0,1,0,1);

        gem.setImageSrc("mvre/media/images/earth.jpg");
        var m = new ModelLoader();
        m.loadModel(gl, gem, "mvre/models/testSphere.obj");
        gem.translate(-1,8,-10);
        gem.setParent(system);
        this.environment.addNode(gem);
        this.enablePhysics();
        gem.setPhysicsWorld(this.physicsWorld);


        floor = new Node("floor");
        floor.components.PhysicsComponent = new PhysicsComponent("physics");
        floor.components.PhysicsComponent.setCollisionResponse(true);

        floor.components.TextureComponent = new TextureComponent("texture");
        floor.setImageSrc("mvre/media/images/crate.jpg");
        //floor.components.PhysicsComponent.setPlane(true);
        var m = new ModelLoader();
        floor.rotate(-.7, glmatrix.vec3.fromValues(0,0,1));
        floor.translate(0,-4,-10);
        //floor.scale(0.5,1,0.5);
        floor.setPhysicsWorld(this.physicsWorld);
        m.loadModel(gl, floor, "mvre/models/floor.obj");
        floor.setParent(system);
        this.environment.addNode(floor);

        this.environment.addNode(system);
        return system;
    }


    Game.prototype.update = function (delta){

        //glmatrix.mat4.identity(moon.tMatrix);
        //moon.translate(0, 3*Math.sin(-moon.curtim/90) ,3*Math.cos(-moon.curtim/90));
        //moon.curtim++;

        time ++;
        time = time % 3600;

        //call update from base class, should always be the last function in the game
        floor.rotate(1/20 * Math.sin(time/10), glmatrix.vec3.fromValues(0,0,1));
        if(gem.components.PhysicsComponent.boundingObject !== null)
            hud.updateText("HEIGHT- " + gem.components.PhysicsComponent.boundingObject.position.y.toFixed(2) + "M")
        //if(gem.components.PhysicsComponent.boundingObject !== null)
        //    console.log(gem.components.PhysicsComponent.boundingObject.position.x, gem.components.PhysicsComponent.boundingObject.position.y, gem.components.PhysicsComponent.boundingObject.position.z);

        BaseGame.prototype.update.call(this, delta);
    }

    return Game;
});