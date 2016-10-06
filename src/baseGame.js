/**
 * Created by ubufu on 9/20/2016.
 */
define(["scene"],function (SceneNode){

    this.init = function(gl){
        var root = new SceneNode(gl);
        root.name = "root";

        root.build(gl);

        return root;
    }


    this.update = function (){

    }
});
