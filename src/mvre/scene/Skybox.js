/**
 * Created by ubufu on 11/9/2016.
 */

define('Skybox',['Cube'], function(Cube) {

    var Skybox = function () {
        Cube.call(this);
    }

    Skybox.prototype = Object.create(Cube.prototype);

    Skybox.prototype.update = function () {
        Cube.prototype.update.call(this);
    }

    return Skybox;
});