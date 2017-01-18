/**
 * Created by ubufu on 1/18/2017.
 */

define('MeshComponent', [], function(){

    //all mesh information used by drawn nodes
    //currently implemented:
    //vertices: O
    //indices: O
    //texCoords: O
    //normals: X

    var MeshComponent = function(){
        this.vertices = [],
        this.indices = [],
        this.texCoords = [],
        this.normals = []
    };

    MeshComponent.prototype.name = 'MeshComponent';

    return MeshComponent;

});