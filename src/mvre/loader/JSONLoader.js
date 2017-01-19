/**
 * Created by ubufu on 1/18/2017.
 *
 * This class will import models created using the three.js json exporter for blender
 *
 * Note: since the file is already in json format, parsing is fairly straightforward:
 * grab the values we need from the json object, and stick them in our node. Easy.
 */

define('JSONLoader', ['glmatrix'],function (glmatrix){

    var JSONLoader = function(){
        this.ready = false;
    };

    JSONLoader.prototype.loadModel = function(gl, node, fileName){
        //rabbit hole fix
        var self = this;

        //load model from file async
        var request = new XMLHttpRequest();
        request.open("GET", fileName, true);

        //trigger onload, which will splice model into verts/tex coords/normals/tangents
        request.onload = function(){
            var data = JSON.parse(request.responseText)

            self._parseGeom(node, data);

            node.components.MeshComponent.vertices = data.vertices;
            node.components.MeshComponent.indices = data.indices;
            node.components.MeshComponent.normals = data.normals;
            node.components.MeshComponent.texCoords = data.uvs;

            if(node.components.AnimationComponent != null){
                node.components.AnimationComponent.skinIndices = data.skinIndices;
                node.components.AnimationComponent.skinWeights = data.skinWeights;
                node.components.AnimationComponent.bones = data.bones;
                node.keyframes = data.keyframes;
            }

            node.build(gl);

        };

        //request file resource from server
        request.send();
    };

    JSONLoader.prototype._parseGeom = function(node, data){
        for(var i = 0; i < data.uvindices.length; i++) {

            var index = data.uvindices[i];

            node.components.MeshComponent.indices.push(i);

            node.components.MeshComponent.vertices.push(data.vertices[index * 3]);
            node.components.MeshComponent.vertices.push(data.vertices[index * 3 + 1]);
            node.components.MeshComponent.vertices.push(data.vertices[index * 3 + 2]);

            node.components.MeshComponent.normals.push(data.normals[index * 3]);
            node.components.MeshComponent.normals.push(data.normals[index * 3 + 1]);
            node.components.MeshComponent.normals.push(data.normals[index * 3 + 2]);

            if( node.components.AnimationComponent != null) {
                node.components.AnimationComponent.skinIndices.push(data.skinIndices[index * 2]);
                node.components.AnimationComponent.skinIndices.push(data.skinIndices[index * 2 + 1]);

                node.components.AnimationComponent.skinWeights.push(data.skinWeights[index * 2]);
                node.components.AnimationComponent.skinWeights.push(data.skinWeights[index * 2 + 1]);
            }

        }
    }

    JSONLoader.prototype.getVertexCount = function(){
        return this.numVertices;
    };

    JSONLoader.prototype.getVertices = function(){
        return this.vertices;
    };

    JSONLoader.prototype.getTextureCoordinates = function(){
        return this.textureCoordinates;
    };

    JSONLoader.prototype.getNormals = function(){
        return this.normals;
    };

    JSONLoader.prototype.getIndices = function(){
        return this.indices;
    };

    return JSONLoader;
});