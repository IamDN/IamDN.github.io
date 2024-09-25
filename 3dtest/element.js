// Define the class
import * as THREE from 'https://threejs.org/build/three.module.js';
import { parameters, updateWidth } from './parametersManager.js';
class Element {

    constructor(setup) {
        this.setup = setup;

         // Create defalut shape for creating mesh
         const length = 1, width = 1;
         const shape = new THREE.Shape();
         shape.moveTo( 0, 0 );
         shape.lineTo( 0, width );
         shape.lineTo( length, width );
         shape.lineTo( length, 0 )
         shape.lineTo( 0, 0 );
         const extrudeSettings = {
         	steps: 2,
         	depth: 1,
         	bevelEnabled: false,
         };
         // Create one desk
         this.geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    }

    test() {
        console.log("test");
    }

    assignTexture(texture) {
        this.mesh = new THREE.Mesh( this.geometry,texture )    
        this.mesh.castShadow = true; //default is fals 
        this.mesh.receiveShadow = true; //default
        this.updateSize();
    }

    updateSize() {
        switch (this.setup.position) {
            case "left":
                this.mesh.position.x = -parameters.width/2;
                this.mesh.position.y = -parameters.height/2;
                this.mesh.position.z = -parameters.depth/2;
                this.mesh.scale.x = 1;
                this.mesh.scale.y = parameters.height;
                this.mesh.scale.z = parameters.depth;
              break;
            case "right":
                this.mesh.position.x = parameters.width/2;
                this.mesh.position.y = -parameters.height/2;
                this.mesh.position.z = -parameters.depth/2;
                this.mesh.scale.x = 1;
                this.mesh.scale.y = parameters.height;
                this.mesh.scale.z = parameters.depth;  
              break;
            case "top":
                this.mesh.position.x = -parameters.width/2;
                this.mesh.position.y = parameters.height/2;
                this.mesh.position.z = -parameters.depth/2;
                this.mesh.scale.x = parameters.width;
                this.mesh.scale.y = 1;
                this.mesh.scale.z = parameters.depth;  
                break;
            case "bottom":
                this.mesh.position.x = -parameters.width/2;
                this.mesh.position.y = -parameters.height/2;
                this.mesh.position.z = -parameters.depth/2;
                this.mesh.scale.x = parameters.width;
                this.mesh.scale.y = 1;
                this.mesh.scale.z = parameters.depth;  
                break;
            case "back":
                this.mesh.position.x = -parameters.width/2;
                this.mesh.position.y = -parameters.height/2;
                this.mesh.position.z = parameters.depth/2;
                this.mesh.scale.x = parameters.width;
                this.mesh.scale.y = parameters.height;
                this.mesh.scale.z = 1;
            default:
              // Code to execute if none of the cases match
          }

    }
}

// Export the class
export default Element;