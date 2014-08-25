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
var onpoint = false;
var stop = false;
var objects = [];
var img = $("#container").data("img"); // 添加场景图片
var point = new Array();
var json = $("#container").data("point");
point = eval("["+json+"]");

// 当鼠标位于侧边栏上时
var over = false;
$(".down,#leftSidebar,#rightSidebar").mousemove(function(){
    over = true;
});
$(".down,#leftSidebar,#rightSidebar").mouseleave(function(){
    over = false;
});

$(".down a:first").mousemove(function(){
    $(this).children("span").attr("class","eye_hover")
});
$(".down a:first").mouseleave(function(){
    $(this).children("span").attr("class","eye");
});

// 清晰度操作
var clarity = 50;
$(".down a").click(function(){
    if( $(this).data("clarity") ){
        clarity = $(this).data("clarity");
        $("canvas").remove();
        init();
        $(".down a").removeClass("active");
        $(this).addClass("active");
    }else if( $(this).data("point") ){
        group.rotation.y = Math.random()*7;
    }
        
});


init();
animate();

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, -window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 0;

    scene = new THREE.Scene();

    group = new THREE.Object3D();
    scene.add( group );

    // 构建球体
    var loader = new THREE.TextureLoader();
    loader.load( img , function ( texture ) {

        var geometry = new THREE.SphereGeometry( 200, clarity, clarity );

        //一定要设置两面
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity: 1, overdraw: 0.9, side: THREE.DoubleSide} );
        
        ball = new THREE.Mesh( geometry, material );
        group.add( ball );
    } );


    // 绘制箭头
    x = y = 0;
    var aShape = new THREE.Shape();

    aShape.moveTo(x,y+10);
    aShape.quadraticCurveTo(x, y+10, x+8, y+4);
    aShape.quadraticCurveTo(x+8, y+4, x+8, y);
    aShape.quadraticCurveTo(x+8, y, x, y+7);
    aShape.quadraticCurveTo(x, y+7, x-8, y);
    aShape.quadraticCurveTo(x-8, y, x-8, y+4);
    aShape.quadraticCurveTo(x-8, y+4, x, y+10);
    aShape.lineTo(x,y+4);
    aShape.quadraticCurveTo(x, y+10, x, y+4);
    aShape.quadraticCurveTo(x, y+4, x+8, y-4);
    aShape.quadraticCurveTo(x+8, y-4, x+8, y-8);
    aShape.quadraticCurveTo(x+8, y-8, x, y+1);
    aShape.quadraticCurveTo(x, y+1, x-8, y-8);
    aShape.quadraticCurveTo(x-8, y-8, x-8, y-4);
    aShape.quadraticCurveTo(x-8, y-4, x, y+4);

    var extrudeSettings = { amount: 1 };
    extrudeSettings.bevelEnabled = true;
    extrudeSettings.bevelSegments = 2;
    extrudeSettings.steps = 2;


    //添加指引
    var geometry1 = new THREE.CylinderGeometry( 5, 0, 100, 3 );
    geometry1.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( Math.PI / 2, Math.PI, 0 ) ) );
    
    $.each(point,function(idx){
        /*******************************************/
        addShape(point[idx].url, aShape, extrudeSettings, 0xffffff, point[idx].x, point[idx].y, point[idx].z, 0, 0, 0, 1 );
        /*******************************************/
    });

    scene.matrixAutoUpdate = false;


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
    //键盘按键
    document.addEventListener( 'keydown', onDocumentKeyDown, false );

}

// 添加 shape 元素
function addShape(url, shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

    var points = shape.createPointsGeometry();
    var spacedPoints = shape.createSpacedPointsGeometry( 100 );

    // flat shape

    var geometry = new THREE.ShapeGeometry( shape );

    var material2 = new THREE.MeshBasicMaterial( { color: color,opacity: 1, overdraw: 1, side: THREE.DoubleSide} );
    var mesh = new THREE.Mesh( geometry, material2 );

    // var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, transparent: true } ) ] );
    mesh.url = url;
    mesh.position.set( x, y, z );
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    group.add( mesh );

    var text3d = new THREE.TextGeometry( "客厅", {
                        size: 5,  //大小
                        height:0,  //厚度
                        curveSegments: 10,  //弧线分段数，使得文字的曲线更加光滑 
                        font: "fzjianzhi-m23s",  //字体
                        // face:"fzjianzhi-m23s",
                        weight:"normal"  //默认
    });
    var textMaterial = new THREE.MeshBasicMaterial( { color: 0xcccccc, overdraw: true } );

    var text = new THREE.Mesh( text3d, textMaterial );
    text.position.set(10,-15,0);
    text.rotation.y = 3.2;
    mesh.add(text);
    objects.push(mesh);


    // 3d shape 立体

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, transparent: true } ) ] );
    mesh.position.set( x, y, z );
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    mesh.lookAt(group.position);
    // group.add( mesh );

    // solid line 实线

    var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 2 } ) );
    line.position.set( x, y, z + 25 );
    line.rotation.set( rx, ry, rz );
    line.scale.set( s, s, s );
    // group.add( line );

    // transparent line from real points

    var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, opacity: 0.5 } ) );
    line.position.set( x, y, z + 75 );
    line.rotation.set( rx, ry, rz );
    line.scale.set( s, s, s );
    // group.add( line );


    // transparent line from equidistance sampled points

    var line = new THREE.Line( spacedPoints, new THREE.LineBasicMaterial( { color: color, opacity: 0.2 } ) );
    line.position.set( x, y, z + 125 );
    line.rotation.set( rx, ry, rz );
    line.scale.set( s, s, s );
    // group.add( line );
}



//调整窗口大小
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = -window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//鼠标按下事件
function onDocumentMouseDown( event ) {
    if(over == false){
        stop = true;
        setTimeout("stop = false",5000);
    }

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownX = group.rotation.y;
    onPointerDownY = group.rotation.x;


    // 点击跳转
    var projector = new THREE.Projector();  
    event.preventDefault();

    var vector = 
     new THREE.Vector3((( event.clientX / window.innerWidth ) * 2 - 1),
             - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    projector.unprojectVector( vector, camera );
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objects );

    if(intersects.length>0){
        console.log(intersects[0]);
        window.location.href= intersects[0].object.url;
    }

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
         var projector = new THREE.Projector();  
        event.preventDefault();

        var vector = 
         new THREE.Vector3((( event.clientX / window.innerWidth ) * 2 - 1),
                 - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );
        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( objects );
        if(intersects.length>0){
            intersects[0].object.scale.set(1.2,1.2,1.2);
            onpoint = true;
            console.log(intersects[0]);
            intersects[0].object.material.color.r = 0;
        }else{
            onpoint = false;
        }
    }

}

//鼠标松开事件
function onDocumentMouseUp( event ) {    
    isUserInteracting = false;
}

//鼠标滚动事件
function onDocumentMouseWheel( event ) 
{   
    if( over == false ){
        camera.fov -= event.wheelDeltaY * 0.02;
        camera.updateProjectionMatrix();
    }
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


    
    // scene.children[ 3 ].lookAt( new THREE.Vector3(0, 0, 0) );


    // camera.lookAt( scene.position );

    if ( isUserInteracting === false && onpoint === false && stop === false) {
        //控制旋转
        group.rotation.y -= 0.002;
    }else{
        group.rotation.y -= 0;
    }


    //上下范围
    group.rotation.x = Math.max( - 1.5, Math.min( 1.5, group.rotation.x ) );

    //放大缩小范围
    camera.fov = Math.max( 20, Math.min( 100, camera.fov ) );

    for(var i=0;i<group.children.length;i++){
        if(onpoint === false){
            group.children[i].scale.set(1,1,1);
            group.children[i].material.color.r = 1;
        }
    }
    

    renderer.render( scene, camera );

}






