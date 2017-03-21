/**
 * Created by ubufu on 2/27/2017.
 */

/**
 * Created by ubufu on 1/20/2017.
 */

define('AudioComponent', ['glmatrix', 'Audio'], function(glmatrix, Audio){

    var AudioComponent = function(node){

        this.VShaderAttributes = [
            ""
        ].join("\n");

        this.VShaderOutput = [
            ""
        ].join("\n");

        this.VShaderMain = [
            ""
        ].join("\n");

        this.FShaderAttributes = [
            ""
        ].join("\n");

        this.FShaderOutput = [
            ""
        ].join("\n");

        this.FShaderMain = [
            ""
        ].join("\n");

        //begin audio specific code
        this.audioPlayer = AudioInstance.getInstance();
        this.audioSource = null;
        this.soundIdentifier = null;
        this.loop = false;
    };

    AudioComponent.prototype.name = 'AudioComponent';

    //create global instance of AudioPlayer shared between instances

    AudioComponent.prototype.build = function(gl, node){
        var self = this;
        this.audioPlayer.addCallbackObject(self);
        this.audioPlayer.load(this.audioSource);

    }

    AudioComponent.prototype.loadComplete = function(){
        this.soundIdentifier = this.getAudioPlayer().create(this.audioSource);
        this.audioPlayer.getContext().listener.positionX.value = 0;
        this.audioPlayer.getContext().listener.positionY.value = 0;
        this.audioPlayer.getContext().listener.positionZ.value = 0;
        this.getAudioPlayer().play(this.soundIdentifier, this.loop);
    }

    AudioComponent.prototype.getAudioPlayer = function(){
        return this.audioPlayer;
    }

    AudioComponent.prototype.apply = function(gl, node){
        var position = glmatrix.vec3.create();
        glmatrix.mat4.getTranslation(position, node.tMatrix);

        if(this.soundIdentifier !== null && this.soundIdentifier !== undefined){
            this.audioPlayer.setX(this.soundIdentifier, position[0]);
            this.audioPlayer.setY(this.soundIdentifier, position[1]);
            this.audioPlayer.setZ(this.soundIdentifier, position[2]);
        }
        //console.log(position);
    }

    AudioComponent.prototype.setSource = function(audioSource){
        this.audioSource = audioSource;
    }

    AudioComponent.prototype.play = function(){

    }

    AudioComponent.prototype.repeat = function(b){
        this.loop = b;
    }


    return AudioComponent;

});