$(function() {
	function plusReady() {}
	if(window.plus) {
		plusReady()
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	mui.plusReady(function() {
		var playTop = plus.navigator.getStatusbarHeight();
		$('.before_search').css('height',playTop)
//		$('.search_head').css('top',playTop)
	})

	

	$('body').on('tap', '.search_cancel', function() {
		$('.search_lists').empty();
		$('#searchinput').val("");
		
	})


		$('#searchinput').on('input propertychange', function() {

			var value = $(this).val().replace(/[\r\n]/g, "");
			$.ajax({
				type: "get",
				url: config.data + "h5/getH5ByMsg",
				async: true,
				data: {
					"msg": value
				},
				success: function(data) {
					if(data.state) {

						var h = data.h5;

						var div = "";
						for(var i = 0; i < h.length; i++) {
							div +=
								"<div class='search_list' data-id=" + h[i].id + " data-sort=" + h[i].sort + " data-url='" + h[i].url + "'>" +
								"<div class='h5img' style='background-image:url(" + config.img + encodeURI(h[i].title_img) + ")'></div>" +
								"<div class='h5art'>" +
								"<div class='ofh' style='line-height: 2.875rem;'>" +
								"<div class='h5head fl' style='background-image:url(" + config.img + encodeURI(h[i].icon) + ")'></div>" +
								"<div class='font_14 fl ofh' style='max-width: 10rem;white-space: nowrap;text-overflow: ellipsis;'>" + h[i].name + "</div>" +
								"<div class='font_14 color_blue fr enter' >进入游戏 >></div>" +
								"</div>" +
								"<div class='font_12' style='margin-left: 0.75rem;margin-bottom: 1rem;'>" + h[i].commend + "</div>" +
								"</div>" +
								"</div>"
						};
						$('.search_lists').empty().append(div);
						
						$('.search_lists').on('tap', '.search_list', function() {
							var url = $(this).attr('data-url');
                            toH5(url);
						})
					} else {

					}
				}
			});
		})
	
	$('body').on('input', 'input[type=text],.search_bar', function() {
		val = $('.search_bar').val().replace(/[&\|\\\*^%$#@\-]/g,"");
		$('.search_lists').children().remove();	
		if(val){		
			pages = 1
			$.ajax({
				type:"get",
				url:config.data + "h5/searchByGameName",
				async:true,
				data:{
					sys:2,
					msg:val,
					page:1
				},
				timeout:20000,
				success:function(data){
					$('.error').html("");
					if (data.state) {
						
						var  div = '';
						var g = data.gameList;
						if (g.length > 0) {
							for (var i = 0; i < g.length; i++) {
								div+=
								"<div class='search_list font_12 simHei' data-id='"+ g[i].id +"' data-sort='" + g[i].sort + "' data-url='" + g[i].url + "'>"+
									"<span class='search_liastImg fl' style='background-image:url(" + config.img + encodeURI(g[i].icon) + ")'></span>"+
									"<div class='fl' style='margin-left: 1rem;'>"+ g[i].name +"</div>"+
								"</div>"
							}
							
							$('body').on('tap','.search_list',function(){
								var url = $(this).attr('data-url');
									mui.openWindow({
										url: 'h5game.html',
										id: 'h5game.html',
										styles: {
											top: 0, //新页面顶部位置
											bottom: 0 //新页面底部位置
											//		   width:100%,//新页面宽度，默认为100%
											//		      height:100%,//新页面高度，默认为100%
										},
										extras: {
											url: url
										},
										createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
										show: {
											autoShow: true, //页面loaded事件发生后自动显示，默认为true
											aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
											//    duration:animationTime//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
										},
										waiting: {
											autoShow: true, //自动显示等待框，默认为true
											title: '正在加载...', //等待对话框上显示的提示内容
											options: {
												//      width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
												//      height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
												//      ......
											}
										}
									})
})
							$('.search_lists').append(div);
							
							
						} else{
							
							var no_content = "<div class='no_content tac'>没有搜到任何内容</div>"
							$('.search_lists').empty().append(no_content)
						}
						
					} else{
						mui.toast("搜索失败")
					}
				},
				error:function(){
					var errorHTML="<div style='margin-top:10rem'><img style='width:138px;height:180px;display:block;margin:0 auto;' src='../../Public/image/notonline.png' /></div>";
       	            $('.error').html(errorHTML);
				}
			});
		}
	})
	
	
	$('body').on('tap','.search_img',function(){
		var url=$('.search_list:first').attr('data-url');
		if(url){
			toH5(url);
		}else{
			mui.toast("请输入搜索内容")
		}
	})
	
})






function toH5(url){
	mui.openWindow({
		url: 'h5game.html',
		id: 'h5game.html',
		styles: {
			top: 0, //新页面顶部位置
			bottom: 0 //新页面底部位置
	         //		   width:100%,//新页面宽度，默认为100%
		     //		      height:100%,//新页面高度，默认为100%
			},
		extras: {
			url: url
	    },
		createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    show: {
		    autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
			//    duration:animationTime//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	    },
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '正在加载...', //等待对话框上显示的提示内容
			options: {
										//      width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
										//      height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
										//      ......
			}
	    }
	})

}
