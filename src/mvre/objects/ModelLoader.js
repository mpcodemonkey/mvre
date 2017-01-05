/**
 * Created by ubufu on 11/14/2016.
 */
define('ModelLoader', ['glmatrix'],function (glmatrix){

    var ModelLoader = function(){
        this.vertices = [];
        this.numVertices = 0;
        this.textureCoordinates = [];
        this.normals = [];
        this.indices = []

    }

    ModelLoader.prototype.parseObjFile = function(fileName){

        var vertexValues = [];
        var stValues = [];
        var normalValues = [];

        var data = FileHelper.readStringFromFileAtPath(fileName);
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

                    this.vertices.push(vertexValues[vertRef]);
                    this.vertices.push(vertexValues[vertRef + 1]);
                    this.vertices.push(vertexValues[vertRef + 2]);

                    this.textureCoordinates.push(stValues[tcRef]);
                    this.textureCoordinates.push(stValues[tcRef + 1]);

                    this.normals.push(normalValues[normRef]);
                    this.normals.push(normalValues[normRef + 1]);
                    this.normals.push(normalValues[normRef + 2]);

                    this.indices.push(1*v);
                    this.indices.push(1*vt);
                    this.indices.push(1*vn);
                }
            }
        }

        this.numVertices = this.vertices/3;
    }

    ModelLoader.prototype.getVertexCount = function(){
        return this.numVertices;
    }

    ModelLoader.prototype.getVertices = function(){
        return this.vertices;
    }

    ModelLoader.prototype.getTextureCoordinates = function(){
        return this.textureCoordinates;
    }

    ModelLoader.prototype.getNormals = function(){
        return this.normals;
    }

    ModelLoader.prototype.getIndices = function(){
        return this.indices;
    }

    function FileHelper()
    {}
    {
        FileHelper.readStringFromFileAtPath = function(pathOfFileToReadFrom)
        {
            var request = new XMLHttpRequest();
            request.open("GET", pathOfFileToReadFrom, false);
            request.send(null);
            var returnValue = request.responseText;

            return returnValue;
        }
    }

    return ModelLoader;
});