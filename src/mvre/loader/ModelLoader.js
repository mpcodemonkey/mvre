/**
 * Created by ubufu on 11/14/2016.
 */
define('ModelLoader', ['glmatrix', 'EventEmitter'],function (glmatrix, Events){

    var ModelLoader = function(){
        this.ready = false;
        this.vertices = [];
        this.numVertices = 0;
        this.textureCoordinates = [];
        this.normals = [];
        this.indices = [];

        this.onCompleteEvent = new Event('onComplete');

    };

    ModelLoader.prototype.loadModel = function(gl, node, fileName){
        //rabbit hole fix
        var self = this;

        //load model from file async
        var request = new XMLHttpRequest();
        request.open("GET", fileName, true);

        //trigger onload, which will splice model into verts/tex coords/normals/tangents
        request.onload = function(){
            //el cheapo async call
            self.parseObjFile(request.responseText)
                .then(function(){
                    node.buildFromFile(gl, self);
            });

        };

        request.send(null);
    };

    ModelLoader.prototype.parseObjFile = function(data){

        var self = this;

        return new Promise(function(resolve, reject){
            var vertexValues = [];
            var stValues = [];
            var normalValues = [];

            var lines = data.split("\n");
            for(var i = 0; i < lines.length; i++){
                var line = lines[i];

                if(line.substr(0, 2) === "v "){
                    var tmp = line.substr(2).split(" ");
                    for(var s = 0; s < tmp.length; s++){
                        vertexValues.push(1.0*tmp[s]);
                    }
                }
                else if(line.substr(0,2) === "vt"){
                    var tmp = line.substr(3).split(" ");
                    for(var s = 0; s < tmp.length; s++){
                        stValues.push(1.0*tmp[s]);
                    }
                }
                else if(line.substr(0,2) === "vn"){
                    var tmp = line.substr(3).split(" ");
                    for(var s = 0; s < tmp.length; s++){
                        normalValues.push(1.0*tmp[s]);
                    }
                }
                else if(line[0] === "f"){
                    var tmp = line.substr(2).split(" ");
                    for(var s = 0; s < tmp.length; s++){
                        var v = tmp[s].split("/")[0];
                        var vt = tmp[s].split("/")[1];
                        var vn = tmp[s].split("/")[2];

                        var vertRef = ((1*v)-1)*3;
                        var tcRef = ((1*vt)-1)*2;
                        var normRef = ((1*vn)-1)*3;

                        self.vertices.push(vertexValues[vertRef]);
                        self.vertices.push(vertexValues[vertRef + 1]);
                        self.vertices.push(vertexValues[vertRef + 2]);

                        self.textureCoordinates.push(stValues[tcRef]);
                        self.textureCoordinates.push(stValues[tcRef + 1]);

                        self.normals.push(normalValues[normRef]);
                        self.normals.push(normalValues[normRef + 1]);
                        self.normals.push(normalValues[normRef + 2]);

                        self.indices.push(1*v);
                        self.indices.push(1*vt);
                        self.indices.push(1*vn);
                    }
                }
            }

            self.numVertices = self.vertices/3;

            resolve();
        })

    };

    ModelLoader.prototype.getVertexCount = function(){
        return this.numVertices;
    };

    ModelLoader.prototype.getVertices = function(){
        return this.vertices;
    };

    ModelLoader.prototype.getTextureCoordinates = function(){
        return this.textureCoordinates;
    };

    ModelLoader.prototype.getNormals = function(){
        return this.normals;
    };

    ModelLoader.prototype.getIndices = function(){
        return this.indices;
    };

    return ModelLoader;
});