/**
 * Created by ubufu on 1/19/2017.
 */

define('LightingComponent', [], function(){

    //all information used by lit nodes
    //currently implemented:
    //normals: O

    var LightingComponent = function(){
        this.normals = []
    };

    LightingComponent.prototype.name = 'LightingComponent';

    return LightingComponent;

});