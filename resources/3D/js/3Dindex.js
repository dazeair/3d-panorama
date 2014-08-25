var container, stats;
var camera, scene, renderer;
var group;
var ball;
var mouseX = 0, mouseY = 0;
var isUserInteracting = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// 自加变量
var projector;
var stop = false;
var objects = [];
var canvas_width = window.innerWidth;
var canvas_height = 400;

var load_img;
var json = eval("["+$("#canvas").data("json")+"]");


init();
animate();

function init() {

    $("#circularG").css("display","block");
    load_img = json[0].src;

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, -canvas_width / canvas_height, 1, 2000 );
    camera.position.z = 0;

    scene = new THREE.Scene();

    group = new THREE.Object3D();
    scene.add( group );

    // 构建球体
    var loader = new THREE.TextureLoader();
    loader.load( load_img , function ( texture ) {
        $("#circularG").css("display","none");
        var geometry = new THREE.SphereGeometry( 200, 20, 20 );

        //一定要设置两面
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity: 1, overdraw: 0.9, side: THREE.DoubleSide} );
        
        ball = new THREE.Mesh( geometry, material );
        group.add( ball );
    } );


    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0xffffff );
    renderer.setSize( canvas_width, canvas_height );

    container.appendChild( renderer.domElement );

    // 状态
    // stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.top = '0px';
    // container.appendChild( stats.domElement );


    //调整浏览器窗口的大小
    window.addEventListener( 'resize', onWindowResize, false );
    // 鼠标滚动
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    // 键盘按键
    document.addEventListener( 'keydown', onDocumentKeyDown, false );

    $("canvas").mousedown(onDocumentMouseDown);
    $("canvas").mouseup(onDocumentMouseUp);
    $("canvas").mousemove(onDocumentMouseMove);

    $("#canvas li").click(function(){
        var load_img = json[$(this).data("slide-to")].src;
        $("#canvas li").attr("class","");
        $(this).attr("class","active");

        $("#circularG").css("display","block");
        group.remove(ball);
        loader.load( load_img , function ( texture ) {
            $("#circularG").css("display","none");
            var geometry = new THREE.SphereGeometry( 200, 20, 20 );

            var material = new THREE.MeshBasicMaterial( { map: texture,opacity: 1, overdraw: 0.9, side: THREE.DoubleSide} );
            
            ball = new THREE.Mesh( geometry, material );
            group.add( ball );
            group.rotation.x = 0;
        } );

    });

}

//调整窗口大小
function onWindowResize() {
    windowHalfX = canvas_width / 2;
    windowHalfY = canvas_height / 2;

    camera.aspect = -canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas_width, canvas_height );
}

//鼠标按下事件
function onDocumentMouseDown( event ) {
    stop = true;
    setTimeout("stop = false",5000);


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
            group.rotation.x = ( onPointerDownPointerY - event.clientY )*0.003+onPointerDownY;
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
function onDocumentMouseWheel( event ) {
    

}

//键盘按下事件
function onDocumentKeyDown( event ) {
    var code = event.keyCode;
    if(code == 32){
        stop = true;
        setTimeout("stop = false",5000);
    }
}

function animate() {

    requestAnimationFrame( animate );

    render();
    // stats.update();

}

function render() {

    //相机位置
    camera.position.x = 0;
    camera.position.y = -20;
    camera.position.z = 0;

    if ( isUserInteracting === false && stop === false) {
        //控制旋转
        group.rotation.y -= 0.002;
    }else{
        group.rotation.y -= 0;
    }

    //上下范围
    group.rotation.x = Math.max( - 1.5, Math.min( 1.5, group.rotation.x ) );

    //放大缩小范围
    camera.fov = Math.max( 20, Math.min( 100, camera.fov ) );
    

    renderer.render( scene, camera );

}