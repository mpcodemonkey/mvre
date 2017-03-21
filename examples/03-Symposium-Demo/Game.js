/**
 * Created by ubufu on 11/14/2016.
 */
/**
 * Created by ubufu on 9/20/2016.
 */
define('Game', ["BaseGame", "Environment", "Skybox", "Shaders", "Node", "Cube", "glmatrix", "TranslationController", "RotationController", "ModelLoader", "HUD", 'TextureComponent', 'PhysicsComponent', 'IFR', 'AudioComponent', 'cannon'],
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
    PhysicsComponent,
    IFR,
    AudioComponent,
    cannon){

    var Game = function(Environment){
        BaseGame.call(this, Environment);
    }

    Game.prototype = Object.create(BaseGame.prototype);


    /**
     * All variable declarations should occur here for
     * global values that will be used throughout the
     * game.
     */

    /*
    This is a simple game demo used for the Symposium at
    California State University, Sacramento. It is reminiscent
    of a carnival game involving a pneumatic gun that fires a
    ball at targets
     */
    var system = null;
    var shelves = [];
    var targets = [];
    var projectile = null;
    var scoreHUD = null;
    var ballHUD = null;
    var ballCount = 0;
    var score = 0;
    var runFlag = false;
    var skybox = null;

    /**
     * This is where the initial Scenegraph and all control logic
     * for a given application must be written.
     * @param gl - the gl object
     */
    Game.prototype.init = function(gl){


        //first things first: we need physics
        this.enablePhysics();
        //create the initial system node
        system = new Node("system");
        system.setDrawable(false);
        this.environment.addNode(system);

        //we need a skybox
        skybox = new Node("skybox");
        skybox.components.TextureComponent = new TextureComponent("texture");
        skybox.setImageSrc("mvre/media/images/bg.jpg");
        var m = new ModelLoader();
        m.loadModel(gl, skybox, "mvre/models/cube.obj");
        skybox.setParent(system);
        this.environment.addNode(skybox);

        //create the targets
        let shelfPosition = 0;
        let shelfHeight = 0;
        for(var i = 0; i < 18; i++){
            targets[i] = new Node("target");
            targets[i].components.PhysicsComponent = new PhysicsComponent(targets[i]);
            targets[i].components.PhysicsComponent.setCollisionResponse(true);
            targets[i].components.PhysicsComponent.setMass(.01);
            targets[i].components.TextureComponent = new TextureComponent("texture");
            targets[i].setImageSrc("mvre/media/images/default.jpg");
            var m = new ModelLoader();
            if(i % 3 == 0 && i != 0){
                shelfHeight -= 4;
                shelfPosition = shelfPosition > 20 ? 24 : 0;
            }
            if(i % 9 == 0 && i != 0){
                shelfHeight = 0;
                shelfPosition = 24;
            }
            targets[i].translate(-16 + shelfPosition,6 + shelfHeight, -18);
            shelfPosition += 4;
            targets[i].setPhysicsWorld(this.physicsWorld);
            m.loadModel(gl, targets[i], "mvre/models/cube.obj");
            targets[i].setParent(system);
            this.environment.addNode(targets[i]);
        }

        //create the shelves

        let count = 0;
        for(var i = 0; i < 6; i++){
            shelves[i] = new Node("shelf");
            shelves[i].components.PhysicsComponent = new PhysicsComponent(shelves[i]);
            shelves[i].components.PhysicsComponent.setCollisionResponse(true);

            shelves[i].components.TextureComponent = new TextureComponent("texture");
            shelves[i].setImageSrc("mvre/media/images/crate.jpg");
            var m = new ModelLoader();
            if(i % 2 == 0){
                shelves[i].translate(-12,0,0);
                count+=4;
            }
            else{
                shelves[i].translate(12,0,0);
            }
            shelves[i].translate(0,8-count, -20);
            shelves[i].scale(2,1,0.5);
            shelves[i].setPhysicsWorld(this.physicsWorld);
            m.loadModel(gl, shelves[i], "mvre/models/floor.obj");
            shelves[i].setParent(system);
            this.environment.addNode(shelves[i]);
        }

        //create the targets and score HUD
        ballHUD = new HUD("Ball HUD");
        ballHUD.setText("SHOTS TAKEN - " + ballCount);
        ballHUD.components.MeshComponent.setColor(0,1,0,1);
        ballHUD.scale(0.5,0.5,0.5);
        ballHUD.translate(0.2, 0, 0);
        ballHUD.build(gl);
        ballHUD.setParent(system);
        this.environment.addNode(ballHUD);

        scoreHUD = new HUD("Score HUD");
        scoreHUD.setText("TARGETS HIT - " + score);
        scoreHUD.components.MeshComponent.setColor(0,1,0,1);
        scoreHUD.scale(0.5,0.5,0.5);
        scoreHUD.translate(0.2, -0.05, 0);
        scoreHUD.build(gl);
        scoreHUD.setParent(system);
        this.environment.addNode(scoreHUD);

        //now we need a projectile

        projectile = new Node("projectile");
        projectile.components.TextureComponent = new TextureComponent("texture");
        projectile.components.PhysicsComponent = new PhysicsComponent(projectile);
        projectile.components.PhysicsComponent.setCollisionResponse(true);
        projectile.components.PhysicsComponent.setMass(1);
        projectile.components.PhysicsComponent.setBoundingType("sphere");
        projectile.components.MeshComponent.setColor(0,1,0,1);

        projectile.setImageSrc("mvre/media/images/earth.jpg");
        var m = new ModelLoader();
        m.loadModel(gl, projectile, "mvre/models/testSphere.obj");
        projectile.translate(0,-10,0);
        projectile.setParent(system);
        projectile.setPhysicsWorld(this.physicsWorld);

        this.environment.addNode(projectile);



        this.environment.addNode(system);

        //testing Invisible Face Rod
        faceblock = new IFR("Invisible Face Rod");
        faceblock.components.PhysicsComponent = new PhysicsComponent(faceblock);
        faceblock.components.PhysicsComponent.setCollisionResponse(false);
        faceblock.components.PhysicsComponent.setMass(1);
        //faceblock.components.PhysicsComponent.setBoundingType("box");
        faceblock.setPhysicsWorld(this.physicsWorld);
        faceblock.translate(0,0,-10);
        faceblock.setParent(system);
        faceblock.components.AudioComponent = new AudioComponent("audio");
        faceblock.components.AudioComponent.setSource('mvre/media/audio/orange.ogg');
        faceblock.build(gl);

        this.environment.addNode(faceblock);

        return system;
    }


    Game.prototype.update = function (delta){
        if(!runFlag && projectile.components.PhysicsComponent.boundingObject != null){
            projectile.components.PhysicsComponent.boundingObject.addEventListener("collide",function(e){
                if(e.body.parent !== undefined) {
                    if(e.body.parent.name === "target"){
                        score++;
                        scoreHUD.updateText("TARGETS HIT - " + score);
                    }
                }
            });
            runFlag = true;
        }

        //glmatrix.mat4.identity(moon.tMatrix);
        //moon.translate(0, 3*Math.sin(-moon.curtim/90) ,3*Math.cos(-moon.curtim/90));
        //moon.curtim++;

        //time ++;
        //time = time % 3600;

        //call update from base class, should always be the last function in the game
        //floor.rotate(1/20 * Math.sin(time/10), glmatrix.vec3.fromValues(0,0,1));
        //if(gem.components.PhysicsComponent.boundingObject !== null)
            //hud.updateText("HEIGHT- " + gem.components.PhysicsComponent.boundingObject.position.y.toFixed(2) + "M")
        //if(gem.components.PhysicsComponent.boundingObject !== null)
        //    console.log(gem.components.PhysicsComponent.boundingObject.position.x, gem.components.PhysicsComponent.boundingObject.position.y, gem.components.PhysicsComponent.boundingObject.position.z);

        BaseGame.prototype.update.call(this, delta);
    }

    // This function serves as the entry point for click and
    // Controller events to the engine. Right now, only
    // onClick() is supported, so only one button can
    // be used in game
    Game.prototype.handleInput = function(view){
        //use the data from the faceblock to get the firing angle and velocity of the projectile

        var phys = projectile.components.PhysicsComponent.boundingObject;
        phys.velocity.set(0, 0, 0);
        var ifrPhys = faceblock.components.PhysicsComponent.boundingObject;
        var tVector = glmatrix.vec3.create();
        var rVector = glmatrix.vec3.create();
       // var vMatrix = glmatrix.mat4.fromValues(view[0],view[1],view[2],view[3],view[4],view[5],view[6],view[7],view[8],view[9],view[10],view[11],view[12],view[13],view[14],view[15] );
        glmatrix.mat4.getTranslation(tVector, faceblock.tMatrix);
        //glmatrix.mat4.getRotation(rVector, vMatrix);
        glmatrix.mat4.identity(projectile.tMatrix);
        //glmatrix.mat4.identity(projectile.rMatrix);
        phys.position.set(0,0,0);
        //projectile.translate(tVector[0], tVector[1], tVector[2]);
        glmatrix.vec3.normalize(tVector, tVector);
        phys.velocity.set(tVector[0] * 200, tVector[1] * 200, tVector[2] * 200);

        ballCount++;
        ballHUD.updateText("SHOTS TAKEN - " + ballCount);

    }

    return Game;
});