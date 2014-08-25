/*
** 3D效果
*/
var container, stats;
var camera, scene, renderer;
var group;
var ball;
var mouseX = 0, mouseY = 0;
var isUserInteracting = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var projector,add=1,x,y,z;
var objects = [],
    p = [];
var img = $("#container").data("img");

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, -window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 0;

    scene = new THREE.Scene();

    group = new THREE.Object3D();
    scene.add( group );

    // 构建球体
    var loader = new THREE.TextureLoader();
    loader.load( img, function ( texture ) {

        var geometry = new THREE.SphereGeometry( 200, 20, 20 );

        //一定要设置两面
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity: 1, overdraw: 0.5, side: THREE.DoubleSide} );
        
        ball = new THREE.Mesh( geometry, material );
        group.add( ball );     
    } );

    //添加隔离层
    ballMesh = new THREE.Mesh(new THREE.SphereGeometry(180, 20, 20), new THREE.MeshLambertMaterial({ color: 0xffffff,opacity: 0,overdraw: 0, side: THREE.DoubleSide }));
    group.add(ballMesh);
    objects.push(ballMesh);

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
    $("#container").mousedown(onDocumentMouseDown);
    var interval;
    $(".keyboard a").mousedown(function(){
        code = $(this).data("code");
        interval = setInterval(function(){
            rotation( code );
        },10);
    });
    $(".keyboard a").mouseup(function(){
        clearInterval(interval);
        onDocumentKeyUp();
    });
    //鼠标右击
    document.addEventListener( 'contextmenu', onDocumentContextMenu, false );
    //鼠标移动
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //鼠标松开
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    //鼠标滚动
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    //键盘按键
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );

}

//调整窗口大小
function onWindowResize() {
    camera.aspect = -window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//鼠标按下事件
function onDocumentMouseDown( event ) {
    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownX = group.rotation.y;
    onPointerDownY = group.rotation.x;

}

//鼠标右击事件
function onDocumentContextMenu(event){
    if(add == 1){
        add = 0;
        var projector = new THREE.Projector();  
        event.preventDefault();

        var vector = 
         new THREE.Vector3((( event.clientX / window.innerWidth ) * 2 - 1),
                 - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );
        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( objects );

        if(intersects.length>0){
            var loader = new THREE.TextureLoader();

            var geometry = new THREE.SphereGeometry(5, 20, 20)

            //一定要设置两面
            var material = new THREE.MeshBasicMaterial( { color: 0xba2c1c,opacity: 1, overdraw: 0.5, side: THREE.DoubleSide} );
            
            direct = new THREE.Mesh( geometry, material );
            direct.position=intersects[0].point;
            direct.rotation.y = - camera.rotation.y;
            

            // 记录当前选择的位置
            x = intersects[0].point.x;
            y = intersects[0].point.y;
            z = intersects[0].point.z;
            
            $("#post").css("display","block");
            $("#close").click(function(){
                $("#post").css("display","none");
                add = 1;
            })

            $("#url").find('img').click(function(e){
                var me = this;
                url = $(me).data("url");
                curpoid = $(me).data("curpoid");
                connpoid = $(me).data("connpoid");
                $("#url").find('img').attr("class","");
                $(me).attr("class","img-link");
            });



            $("#submit").click(function(){
                p = {
                    x:x,
                    y:y,
                    z:z,
                    url:url
                }
                // 提交表单
                var str = JSON.stringify(p);
                action = this.getAttribute("action");
                form = $("<form></form>");
                form.attr('action',action);
                form.attr('method','post');
                input1 = $("<input type='hidden' name='json'/>");
                input1.attr('value',str);
                input2 = $("<input type='hidden' name='curpoid'/>");
                input2.attr('value',curpoid);
                input3 = $("<input type='hidden' name='connpoid'/>");
                input3.attr('value',connpoid);
                form.append(input1);
                form.append(input2);
                form.append(input3);
                form.appendTo("body");
                form.css('display','none');
                console.log(str);
                // form.submit();
                group.add( direct );

            });

            
        }
    }
    
}

//鼠标移动事件
function onDocumentMouseMove( event ) {

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

//键盘按下事件
function onDocumentKeyDown( event ) {
    var code = event.keyCode;
    rotation(code);
}

function rotation(code){
    if(code == 37){ // 左
        camera.rotation.y -= 0.01;
        $("#left").addClass("active");
    }else if(code == 38){ // 上
        camera.rotation.x += 0.01;
        $("#up").addClass("active");
    }else if(code == 39){ // 右
        camera.rotation.y += 0.01;
        $("#right").addClass("active");
    }else if(code ==  40){ // 下
        camera.rotation.x -= 0.01;
        $("#down").addClass("active");
    }
}

function onDocumentKeyUp(event) {
    var key = $(".keyboard a");
    $.each( key ,function(idx){
        $(key[idx]).removeClass("active");
    });
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

    // camera.lookAt( scene.position );

    // if ( isUserInteracting === false ) {
    //     //控制旋转
    //     camera.rotation.y -= 0.002;
    // }else{
    //     camera.rotation.y -= 0;
    // }

    //上下范围
    camera.rotation.x = Math.max( - 1.5, Math.min( 1.5, camera.rotation.x ) );

    //放大缩小范围
    camera.fov = Math.max( 20, Math.min( 100, camera.fov ) );

    renderer.render( scene, camera );

}

