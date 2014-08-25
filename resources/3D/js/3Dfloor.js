/*
** 3D效果
*/
var container, stats,canvas;
var camera, scene, renderer;
var group;
var ball;
var mouseX = 0, mouseY = 0;
var isUserInteracting = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var projector;
var objects = [];

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );

    camera.position.z = 0;

    scene = new THREE.Scene();

    group = new THREE.Object3D();
    group.rotation.x = -0.2;
    group.rotation.z = 0.3;
    scene.add( group );


    // 添加地板
    var materials = [
        loadTexture( '../../resources/3D/img/border.jpg' ), // right
        loadTexture( '../../resources/3D/img/border.jpg' ), // left
        loadTexture( '../../resources/3D/img/border.jpg' ), // top
        loadTexture( '../../resources/3D/img/border.jpg' ), // bottom
        loadTexture( '../../resources/3D/img/1.jpg' ), // front
        loadTexture( '../../resources/3D/img/back.jpg' ) // back
    ];
    material = new THREE.Mesh( new THREE.BoxGeometry( 200, 300, 5, 7, 7, 7 ), 
            new THREE.MeshFaceMaterial( materials ) 
        );
    // material.scale.x = - 1;
    group.add(material);


    // 光照
    var light = new THREE.PointLight(0xffffff, 2, 100); 
    light.position.set(300, 300, 200); 
    scene.add(light);

    // 阴影
    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;

    var geometry = new THREE.PlaneGeometry( 300, 300, 3, 3 );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    group.add( mesh );
    


    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    // 状态
    // stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // container.appendChild( stats.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //调整浏览器窗口的大小
    window.addEventListener( 'resize', onWindowResize, false );
    //鼠标按下
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //鼠标移动
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //鼠标松开
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    //鼠标滚动
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    

}

function loadTexture( path ) {

    var texture = new THREE.Texture( canvas );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    var image = new Image();
    image.onload = function () {

        texture.image = this;
        texture.needsUpdate = true;

    };
    image.src = path;

    return material;

}


//调整窗口大小
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    
    // windowHalfX = window.innerWidth / 2;
    // windowHalfY = window.innerHeight / 2;

    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth, window.innerHeight );
}

//鼠标按下事件
function onDocumentMouseDown( event ) {
    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownX = group.rotation.y;
    onPointerDownY = group.rotation.x;

}

//鼠标移动事件
function onDocumentMouseMove( event ) {

    if ( isUserInteracting === true ) {
        group.rotation.y = ( event.clientX - onPointerDownPointerX )*0.003+onPointerDownX;
        if( group.rotation.x >= -2.5 && group.rotation.x <= 1.5 ){
            group.rotation.x = -( onPointerDownPointerY - event.clientY )*0.003 +onPointerDownY;
        }else if( group.rotation.x < -1.6 ){
            group.rotation.x += 0;
        }else if( group.rotation.x > 1.6 ){
            group.rotation.x += 0;
        }else{
            group.rotation.x = ( onPointerDownPointerY - event.clientY )*0.003+onPointerDownY;
        }
    }else{
        
    }

}

//鼠标松开事件
function onDocumentMouseUp( event ) {

    isUserInteracting = false;

}

//鼠标滚动事件
function onDocumentMouseWheel( event ) 
{
    
    camera.fov -= event.wheelDeltaY * 0.02;
    camera.updateProjectionMatrix();

}

function animate() {

    requestAnimationFrame( animate );

    render();
    // stats.update();

}

function render() {

    //相机位置
    // camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    // camera.position.z = 300;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 300;

    // camera.lookAt( scene.position );

    if ( isUserInteracting === false ) {
        //控制旋转
        group.rotation.y -= 0.01;
    }else{
        group.rotation.y -= 0;
    }

    //上下范围
    group.rotation.x = Math.max( - 1.5, Math.min( 1.5, group.rotation.x ) );

    //放大缩小范围
    camera.fov = Math.max( 20, Math.min( 100, camera.fov ) );

    renderer.render( scene, camera );

}