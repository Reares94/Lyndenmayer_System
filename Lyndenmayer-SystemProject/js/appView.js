let container;
let scene;
let camera;
var ground;
let renderer;
let controls;
let mouse;
var raycaster;
var triangleMesh = null;

//Scene modeling

function init() 
{

    container = document.querySelector( '#scene-container' );

    //Scene color
  
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(40,110,210)");

    //Camera perspective
  
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 ); 
    camera.position.set(90,90,90);

    //Ground 

    let grassTexture = new THREE.TextureLoader().load('images/grass.jpeg');

    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
  
    grassTexture.repeat.x = 16;
    grassTexture.repeat.y = 16;
  
    let groundMaterial = new THREE.MeshPhongMaterial({map:grassTexture});
  
    groundMaterial.receiveShadow = true;
  
    let groundGeometry = new THREE.BoxGeometry(1000, 1000, 2.7);
  
    groundGeometry.receiveShadow = true;
  
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
  
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = - 45;
   
    ground.receiveShadow = true;
    ground.doubleSided = true;
    scene.add(ground);

    //Render

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.appendChild( renderer.domElement );
  
    //Ambient light

    const ambientLight = new THREE.AmbientLight( 0x404040 );
    

    //Point light
    
    const sphere = new THREE.SphereGeometry( 17.5, 20, 20 );
    let mainLight = new THREE.PointLight(0xffffff , 2500);
    mainLight.add(new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( {color:  0xffaa00} ) ) );
    mainLight.position.set(-20, 280, -20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 1500;

    scene.add(mainLight, ambientLight);
  

    //Cubemap
    var textureLoader = new THREE.TextureLoader();

    materials = [
    new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/forest3/back.jpg"), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/forest3/front.jpg"), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/forest3/top.jpg"), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/forest3/bottom.jpg"), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/forest3/right.jpg"), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/forest3/left.jpg"), side: THREE.BackSide } ),
    
    ];
    
    var skyMaterial = new THREE.MultiMaterial( materials );
    var skyGeometry = new THREE.CubeGeometry( 6000, 6000, 6000 );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,1500,0);
    scene.add( skyBox );

    //Control
    
    controls = new THREE.OrbitControls(camera, container);
    controls.minDistance = camera.near;
    controls.maxDistance = camera.far/4;     
    controls.maxPolarAngle = toRadians(100);
    controls.update();


    //Raycaster

    mouse = new THREE.Vector2(0, 0);
    raycaster = new THREE.Raycaster();
  
    //Animation pointLight
    renderer.setAnimationLoop( () => {

       
        const time = Date.now() * 0.00009;
        mainLight.position.x = Math.sin( time * 0.7 ) * 600;
        mainLight.position.z = Math.cos( time * 1.7) * 600;

        render();


    } );

}

//Render method
function render() 
{
   
    renderer.render( scene, camera );

}

//Window management
function onWindowResize() 
{

    camera.aspect = container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );

}

//Raycaster implementation
function onMouseDown(event) 
{

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersections = raycaster.intersectObject(ground);
    intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

    if (intersection != null && triangleMesh === null) {

        var triangle = new THREE.CircleGeometry(branchRadius * 20, 2);
        var material = new THREE.MeshBasicMaterial( {color: 0xffaa0f} );
        triangleMesh = new THREE.Mesh(triangle, material);

        triangleMesh.rotateX(toRadians(270)); 
        triangleMesh.position.copy(intersection.point);

        triangleMesh.name = 'triangleName';

        scene.add(triangleMesh);

    } else if (intersection != null) {
        triangleMesh.position.copy(intersection.point);
    }

}
//Event Listener

document.getElementById("scene-container").addEventListener('mousedown', onMouseDown, false);
window.addEventListener( 'resize', onWindowResize );

init();








