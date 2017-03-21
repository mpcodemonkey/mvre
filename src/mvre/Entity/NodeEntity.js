/**
 * Created by ubufu on 11/8/2016.
 */

/**
 * This class is based off of the tutorial by Erik Hazzard located at http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
 *
 * A Node Entity is effectively an ID and a position in 3D coordinate space. There are various components, such as meshes, physics objects, and audio objects
 * that can be added to an entity to give it function, which makes the entity-component system highly extensible. Making a full featured object is as simple as
 * defining a few custom components, dropping them in a NodeEntity, and interacting with it.
 */

define('NodeEntity',[], function(){

    var NodeEntity = function(){
        //generate a random ID
        this.ID = Date.now().toString(16) + (Math.random() * 100000000 | 0).toString(16) + Node.prototype._count;

        //increment node count
        Node.prototype._count++;

        //create an empty object to hold components in
        this.components = {};
    }

    NodeEntity.prototype._count = 0;

    NodeEntity.prototype.addComponent = function addComponent ( component ){
        // Add component data to the entity
        // NOTE: The component must have a name property (which is defined as
        // a prototype prototype of a component function)
        if(!component.name){
            console.log("Error: no name associated with the current component. The component was not added");
        }
        else{
            this.components[component.name] = component;
        }
        return this;
    }

    NodeEntity.prototype.removeComponent = function removeComponent ( component ){
        // Remove component data by removing the reference to it.
        // Allows either a component function or a string of a component name to be
        // passed in
        var name = componentName; // assume a string was passed in

        if(typeof componentName === 'function'){
            // get the name from the prototype of the passed component function
            name = componentName.prototype.name;
        }

        // Remove component data by removing the reference to it
        delete this.components[name];
        return this;
    };

    NodeEntity.prototype.print = function print () {
        // Function to print / log information about the entity
        console.log(JSON.stringify(this, null, 4));
        return this;
    };

    return NodeEntity
});