var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// import trhee.js
import * as THREE from 'https://threejs.org/build/three.module.js';
import Element from './Element.js';  // Use the relative path
import { parameters, updateWidth } from './parametersManager.js';

const textureLoader = new THREE.TextureLoader();
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap THREE.PCFSoftShadowMap
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xe8e7cc, 1);
document.body.appendChild(renderer.domElement);

var elementSetups = [
  {"position" : "left" },
  {"position" : "right" }, 
  {"position" : "top" },
  {"position" : "bottom" },
  //{"position" : "back" }
]
var elements=[];
for (var i = 0; i < elementSetups.length; i++) {
  elements.push(new Element(elementSetups[i]));
}


textureLoader.load('text.jpg', function(texture) {
  var texturedMaterial = new THREE.MeshPhongMaterial({
      map: texture,  // Assign the texture to the 'map' property
      color: 0xCCCCCC, // You can still retain the color for tinting
  });
  for (var i = 0; i < elements.length; i++) {
    elements[i].assignTexture(texturedMaterial); 
    scene.add(elements[i].mesh);
  }

});

// Create scene
var scene = new THREE.Scene();

// Add Hemisphere Light
{
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.9);
  hemisphereLight.castShadow = true;
  // The first color is the light from above (sky), the second is the ground light (darker).
  scene.add(hemisphereLight);
}

// Add Directional Light with Shadows
{
  const color = 0xffffff;
  const intensity = 1.0;
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(20, 20, -10);
  
  // Enable shadows for the directional light
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Configure shadow properties (optional, adjust as needed)
  directionalLight.shadow.mapSize.width = 256; // higher values causing fans goes brrrrrr
  directionalLight.shadow.mapSize.height = 256; // higher values causing fans goes brrrrrr
  directionalLight.shadow.camera.near = 10; // default
  directionalLight.shadow.camera.far = 100; // default
  directionalLight.shadow.camera.left = -50; // default
  directionalLight.shadow.camera.right =50; // default
  directionalLight.shadow.camera.top = 50; // default
  directionalLight.shadow.camera.bottom = -50; // default
  scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );
}

// Add Ambient Light
{
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // soft white light
  scene.add(ambientLight);
}

//Add camera
var camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 1000);
scene.add(camera);


// add floor representation
var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
var greenMaterial = new THREE.MeshPhongMaterial({color: 0xCCCCCC});
var plane = new THREE.Mesh(boxGeometry, greenMaterial );
plane.position.x = 25;
plane.position.y = -parameters.height/2-3;
plane.position.z = 25;
plane.scale.x = 100;
plane.scale.z = 100;
plane.scale.y = 1 ;
plane.castShadow = true; //default is false
plane.receiveShadow = true; //default
scene.add(plane);


function render() {
  // get time
  var time = new Date().getTime();
  time *= 0.0001;  // convert time to seconds
// make camera rotating around the scene
  camera.position.x = Math.cos(time) * 20;
  camera.position.z = Math.sin(time) * 20;
  camera.position.y =  10;
  camera.lookAt(0, 0, 0);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}


render();

    // Scroll event handling
const messages = [
   "Scroll to rotate the cube !",
   "Keep going!",
   "You're making the cube spin!",
   "Almost at full rotation...",
   "Enjoy the 3D effect!"
 ];

let value = 1;
window.addEventListener('wheel', (event) => {


  parameters.width += event.deltaY;

  // itirate through cubes array
  for (var i = 0; i < elements.length; i++) {
      elements[i].updateSize();

  }

  // Change message based on scroll
  const messageIndex = Math.floor(( value) * messages.length);
  document.getElementById('message').textContent = messages[0];
});


