var container, stats;
var camera, scene, renderer;
var group;
var ball1,ball2,ball3;
var mouseX = 0, mouseY = 0;
var isUserInteracting = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// 自加变量
var projector;
var mouseenter = false;
var objects = [];
var point = new Array();
var canvas_width = 400;
var canvas_height = 400;

var load_img;
var json = eval("["+$("#canvas").data("json")+"]");
var len = json.length;
var i = 1; // 中间显示位置

init();
animate();

function init() {

    if( len>=3 ){
        $("#img_l").attr("src",json[i-1].src);
        load_img = json[i].src;
        $("#img_r").attr("src",json[i+1].src);
    }

    canvas = document.getElementById( 'canvas' );
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, canvas_width / canvas_height, 1, 2000 );
    camera.position.z = 70;

    scene = new THREE.Scene();

    // 构建球体
    var loader = new THREE.TextureLoader();
    loader.load( load_img , function ( texture ) {

        var geometry = new THREE.SphereGeometry( 20, 20, 20 );

        //一定要设置两面
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity: 1, overdraw: 0.9, side: THREE.DoubleSide} );
        
        ball = new THREE.Mesh( geometry, material );
        scene.add( ball );
    } );


    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0xcccccc );
    renderer.setSize( canvas_width, canvas_height );

    container.appendChild( renderer.domElement );

    // 状态
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

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
    //键盘按键
    document.addEventListener( 'keydown', onDocumentKeyDown, false );

    $("#canvas img,#canvas a").click(function(){
        var this_id = $(this).attr("id");
        if( this_id == "img_l" || this_id == "left" ){
            i = i-1;
            if(i==-1){
                i=len-1;
            }
        }else if( this_id == "img_r" || this_id == "right"  ){
            i = i+1;
            if( i==len){
                i=0;
            }
        }

        left_img = json[(len+i-1)%len].src;
        right_img = json[(i+1)%len].src;

        $("#img_l").animate({opacity:'toggle'},"slow").attr("src",left_img).animate({opacity:'toggle'},"slow");
        load_img = json[i].src;
        $("#img_r").animate({opacity:'toggle'},"slow").attr("src",right_img).animate({opacity:'toggle'},"slow");

        scene.remove(ball);
        $("#circularG").css("display","block");
        loader.load( load_img , function ( texture ) {

            $("#circularG").css("display","none");
            var geometry = new THREE.SphereGeometry( 20, 20, 20 );

            //一定要设置两面
            var material = new THREE.MeshBasicMaterial( { map: texture,opacity: 1, overdraw: 0.9, side: THREE.DoubleSide} );
            ball = new THREE.Mesh( geometry, material );

            scene.add( ball );
        });
    });
    $("#container").mouseenter(function(){
        mouseenter = true;
    });
    $("#container").mouseleave(function(){
        mouseenter = false;
    });

}


//调整窗口大小
function onWindowResize() {
    windowHalfX = canvas_width / 2;
    windowHalfY = canvas_height / 2;

    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas_width, canvas_height );
}

//鼠标按下事件
function onDocumentMouseDown( event ) {


}

//鼠标移动事件
function onDocumentMouseMove( event ) {


}

//鼠标松开事件
function onDocumentMouseUp( event ) {    
    

}

//鼠标滚动事件
function onDocumentMouseWheel( event ) {
    

}

//键盘按下事件
function onDocumentKeyDown( event ) {

}


function animate() {

    requestAnimationFrame( animate );
    render();
    stats.update();

}

function render() {
    if( mouseenter === false ){
        if(camera.position.z < 70){
            camera.position.z += 0.5;
        }
    }else{
        if(camera.position.z > 50){
            camera.position.z -= 0.5;
        }
    }
    
    ball.rotation.y += 0.03 ;    

    renderer.render( scene, camera );

}


