var total_height;
$(function() {
	
	mui.plusReady(function() {
		total_height = plus.navigator.getStatusbarHeight() + 45;
		$('.before_header').css({
			"height": total_height - 45 + "px",
			"width": "100%"
		});
		$('.header_box').next().css("margin-top", total_height + "px");
		
//		过渡动画1
//		var w = plus.nativeUI.showWaiting("", {
//
//			loading: {
//
//				icon: "../../Public/image/maotiao.png", //加载动画地址
//
//				interval: '1000ms',
//
//				height: '50px'
//
//			},
//			height: "80%",
//			width: "100%",
//			
//			size: "200px",
//			modal: false,
//			textalign: "left",
//
//			background: "rgba(0,0,0,0.5)"
//
//		});
//		setTimeout(function(){
//			w.close();
//			
//		},3000)

		


		

	})

});

//测试环境
var config = {
	img: "http://img.oneyouxi.com.cn/",
	apk: "http://apk.oneyouxi.com.cn/",
//	data: "http://192.168.2.156:8877/",
//	data:"http://192.168.2.108:8877/",
//  data:"http://192.168.2.117:8877/",
//	data:"http://182.61.26.179:8877/",
//	data:"http://192.168.0.207:8877/",
//	data:"http://192.168.0.67:8877/",
//	data:"http://192.168.0.207:8877/",
    data:"http://www.oneyouxi.com.cn:8877/",
	base64: "http://base64.oneyouxi.com.cn/",
//	url_upload:"http://182.61.26.179:8878/",
	url_upload:"https://admin.oneyouxi.com.cn/",
//	url_upload:"http://192.168.0.207:8878/",
}

var userInfostr = window.localStorage.getItem("userInfo");
var userInfojson = eval('(' + userInfostr + ')');
if(userInfojson) {
	var userId = userInfojson.id
} else {
	var userId = 0
}


function activeBell(){
	if(userId){
	    $.ajax({
	       type:"get",
	       url:config.data+"news/getTip",
	       async:true,
	       data: {
               "userId": userId
	       },
	       success:function(data){
	       	   if(data.state==1){
	       	   	  $(".bell").addClass("bell_active");
	       	   }else{
	       	   	  $(".bell").removeClass("bell_active");
	       	   }
              
	    }
      });
	}
}