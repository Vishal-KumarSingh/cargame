import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


function App() {
  //const canvaref = useRef();
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75 , window.innerWidth/window.innerHeight ,0.1 , 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth , window.innerHeight);
    console.log("Hello");
    document.body.appendChild( renderer.domElement );
  
    // camera.position.z = 5;

    const light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);
    
    scene.add( new THREE.AmbientLight( 0xffffff, 0.9 ) );
    var loader = new GLTFLoader();
    var carmodel:any = null;
    loader.load("./redcar.glb" , function(gltf : any) {
      scene.add(gltf.scene);
      carmodel = gltf;
      carmodel.scene.position.y = 0.2;
      
    }, undefined , function(error: any){
      console.error(error);
    });



    const texture = new THREE.TextureLoader().load( "textures/water.jpg" ); 
      texture.wrapS = THREE.RepeatWrapping; 
      texture.wrapT = THREE.RepeatWrapping; 
      texture.repeat.set( 4, 4 );


       // Key states
       const keys:object = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
      };
  
      // Update key states on keydown and keyup
      const handleKeyDown = (event:any) => {
        if (keys.hasOwnProperty(event.key)) {
          keys[event.key] = true;
        }
      };
  
      const handleKeyUp = (event:any) => {
        if (keys.hasOwnProperty(event.key)) {
          keys[event.key] = false;
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);




      // const controls = new OrbitControls(camera, renderer.domElement);
      // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      // controls.dampingFactor = 0.25; // how quickly the camera dampens movement
      // controls.screenSpacePanning = false; // prevent panning outside the screen

     


      const direction = new THREE.Vector3( 0 , 1 , 0);
      const gridHelper = new THREE.GridHelper(100, 100 );
      scene.add(gridHelper);
      camera.position.set(3 , 3, 5); // Move the camera back and above the plane

      // Tilt the camera to look down at the plane
      camera.rotation.x = -Math.PI / 6; // Tilt down about 30 degrees

    // plane.rotation.x = -Math.PI / 2;

     


      
    const CarMover = () => {
        if(!carmodel) return;
        var move = false;
        if(keys['ArrowUp']){
          if(lastkey == 2){

            lastkey=1;
            direction.negate(); // Move backward in the Z-axis
            }
            move= true;
          }
           // Move forward in the Z-axis
          
         if(keys['ArrowDown']){
          if(lastkey == 1){
          lastkey=2;
          direction.negate(); // Move backward in the Z-axis
          }
          move=true;
        }
          
        if(keys['ArrowLeft']){
          move=true;
          carmodel.scene.rotation.y += 0.05;
          direction.applyMatrix4(leftrotationMatrix);// Move left in the X-axis
        }
        if(keys['ArrowRight']){
          move=true;
          carmodel.scene.rotation.y -= 0.05;
          direction.applyMatrix4(rightrotationMatrix); // Move right in the X-axis
        }
       // Ignore other keys
       if(!move) return;
      
      // Normalize and scale the direction vector

      direction.normalize().multiplyScalar(0.1);

      // Update the car model's position
      carmodel.scene.position.add(direction);
      camera.position.set(carmodel.scene.position.x + 2 ,
      carmodel.scene.position.y + 2 ,
      carmodel.scene.position.z + 5 , 

      );
      // Ensure the camera looks at the car model's position
      camera.lookAt(carmodel.scene.position);
  };

    function animate()
     { 
      // cube.rotation.x += 0.01; cube.rotation.y += 0.01;
      CarMover();
      // controls.update();
      if(carmodel){
        camera.lookAt(carmodel.scene.position); 
      }
      
      renderer.render( scene, camera ); 
    } 
    var lastkey = 1;
    direction.set(0, 0, -1);
    const leftangle = 0.05; // Convert degrees to radians
    const rightangle = -0.05;
    // Create a rotation matrix around the Y-axis
    const leftrotationMatrix = new THREE.Matrix4().makeRotationY(leftangle);
    const rightrotationMatrix = new THREE.Matrix4().makeRotationY(rightangle);

     renderer.setAnimationLoop( animate );
   

     

     return () => {
      renderer.setAnimationLoop(null);

      // Dispose of resources
      renderer.forceContextLoss();
      renderer.dispose();
      // geometry.dispose();
      // material.dispose();

      // Remove the canvas element
      document.body.removeChild(renderer.domElement);
    };
  } , []);
  

  return null;
}

export default App;
