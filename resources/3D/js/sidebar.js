/*
** 侧边栏控制
*/
var leftSidebar = $("#leftSidebar"),
    leftSidebarCont = $("#leftSidebarCont"),
    leftSidebarSwitch = $("#leftSidebarSwitch"),
    icon = $("#icon"),
    timer = 0,
    n = 0,
    m = 0;
leftSidebarSwitch.click(function(){
        if(icon.attr('class')=="glyphicon glyphicon-chevron-right"){
            clearInterval(timer);
            timer = setInterval(function(){
                if(n >= 0){
                    clearInterval(timer);
                    icon.attr('class','glyphicon glyphicon-chevron-left');
                }else{
                    n += 50;
                    leftSidebar.css('left',n+ 'px');
                }
            },10);
        }else if(icon.attr('class')=="glyphicon glyphicon-chevron-left"){
            clearInterval(timer);
            timer = setInterval(function(){
                if(n <= -250){
                    clearInterval(timer);
                    icon.attr('class','glyphicon glyphicon-chevron-right');
                }else{
                    n -= 50;
                    leftSidebar.css('left',n+ 'px');
                }
            },10);
        }
    }
);



var rightSidebar = $("#rightSidebar"),
    rightSidebarCont = $("#rightSidebarCont"),
    rightSidebarSwitch = $("#rightSidebarSwitch"),
    right_icon = $("#right_icon"),
    right_timer = 0,
    right_n = -25,
    right_m = 0;
rightSidebarSwitch.click(function(){
        if(right_icon.attr('class')=="glyphicon glyphicon-chevron-left"){
            clearInterval(right_timer);
            right_timer = setInterval(function(){
                if(right_n >= -25){
                    clearInterval(right_timer);
                    right_icon.attr('class','glyphicon glyphicon-chevron-right');
                }else{
                    right_n += 5;
                    rightSidebar.css('right',right_n+ 'px');
                }
            },10);
        }else if(right_icon.attr('class')=="glyphicon glyphicon-chevron-right"){
            clearInterval(right_timer);
            right_timer = setInterval(function(){
                if(right_n <= -190){
                    clearInterval(right_timer);
                    right_icon.attr('class','glyphicon glyphicon-chevron-left');
                }else{
                    right_n -= 5;
                    rightSidebar.css('right',right_n+ 'px');
                }
            },10);
        }
    }
);

