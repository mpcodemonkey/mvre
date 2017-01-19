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

        this.VShaderAttributes = [
            "in vec3 a_Position;"
        ].join("\n");

        this.VShaderOutput = [
            ""
        ].join("\n");

        this.VShaderMain = [
            "gl_Position = projectionMat * modelViewMat * transMat * vec4(a_Position, 1.0);"
        ].join("\n");

        this.FShaderAttributes = [
            ""
        ].join("\n");

        this.FShaderOutput = [
            "out vec4 outColor;"
        ].join("\n");

        this.FShaderMain = [
            "outColor = vec4(1.0,0.0,0.0,1.0);"
        ].join("\n");
    };

    MeshComponent.prototype.name = 'MeshComponent';

    return MeshComponent;

});