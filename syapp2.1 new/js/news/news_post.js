var newsId;
var gameId;
var page = 0;
var userId = localStorage.getItem("userId") || 0;
var sys;
var type = 'hot';
var firstImg;
var title;
$(function() {
	$('body').on('tap','a',function(event){
		event.preventDefault();
		var url = $(this).attr('href');
		mui.openWindow({
			url: '../play/h5game.html',
			id: '../play/h5game.html',
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
	
	
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
		    longtap: true, //默认为false
		    swipe: true, //默认为true
			drag: true, //默认为true
			hold: false, //默认为false，不监听
			release: false //默认为false，不监听
		},
		pullRefresh: {
			container: ".new_post_contents", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			up: {
				height: 50, //可选.默认50.触发上拉加载拖动距离
				auto: false, //可选,默认false.自动上拉加载一次
				contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: '没有更多评论了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: up //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			},
			down: {
				style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
				color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
				height: '50px', //可选,默认50px.下拉刷新控件的高度,
				range: '100px', //可选 默认100px,控件可下拉拖拽的范围
				offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
				auto: false, //可选,默认false.首次加载自动上拉刷新一次
				callback: down //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			}

		}

	})
	mui.plusReady(function() {
		total_height = plus.navigator.getStatusbarHeight() + 45;
		var self = plus.webview.currentWebview();
		newsId = self.newsId;
		gameId = self.gameId;
		up();
		$.ajax({
			type: "get",
			url: config.data + "news/getNewsByID",
			async: true,
			data: {
				"id": newsId,
				"userId": userId
			},
			success: function(data) {
				if(data.state) {

					var n = data.news;
					sys = n.sys;
					var add_user = n.add_user || "one";
					var browse = n.browse;
					if(browse > 99) {
						browse = 99
					}

					firstImg = n.img
					title = n.title
					$('.detail').html(n.detail);

                    $(".detail img").attr("data-preview-src","");
                    $(".detail img").attr("data-preview-group","1");
                    
					$('.news_post_content').attr("data-id", n.id)
					$('.news_post_listImg').css("background-image", "url(" + config.img + encodeURI(n.icon) + ")")
					$('h4').text(n.title)
					$('.news_post_listName').text(n.game_name)
					$('.news_userInfo_name').text(add_user)
					$('.news_userInfo_date').text(n.add_time)
//					$('.news_reviewNum').text(n.comment)
					$(".news_post_list").removeClass("hidden")
					if(n.game_id) {
						$('.news_post_list').css("top", total_height + "px")
						$('.new_post_contents').css("margin-top", total_height + 36 + "px")
					} else {
						$('.news_post_list').addClass('hidden')
					}
					if(n.collect) {
						$('.news_collect').attr('data-collect', '1')
						$('.news_collect').css("background-image", "url(../../Public/image/yishoucang.png)")
					} else {
						$('.news_collect').attr('data-collect', '')
						$('.news_collect').css("background-image", "url(../../Public/image/shoucang.png)")
					}

				} else {

				}
			}
		});
		$('body').on('tap', '.more_secondComment,.comment_img', function() {
			if(userId) {
				var commentId = $(this).attr("data-id")
				mui.openWindow({
					url: "news_allComments.html",
					id: "news_allComments.html",
					createNew: true,  
					extras: {
						newsId: newsId,
						commentId: commentId,
						targetUserId: $(this).attr('data-userId'),
						firstImg:firstImg,
						title:title,						
					}
				})
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		$('body').on('tap', '.hot', function() {

			$('.news_post_commentContents').children().remove();
			mui('.new_post_contents').pullRefresh().refresh(true);
			type = 'hot';
			$(this).addClass('color_green')
			$('.time').removeClass('color_green')
			page = 0;
			up()

		})
		$('body').on('tap', '.time', function() {

			$('.news_post_commentContents').children().remove();
			mui('.new_post_contents').pullRefresh().refresh(true);
			type = 'time';
			$(this).addClass('color_green')
			$('.hot').removeClass('color_green')
			page = 0;
			up()

		})

		$('.news_post_list').click(function() {
			mui.openWindow({
				url: "../game/game_detail.html",
				id: "../game/game_detail.html",
				extras: {
					gameId: gameId
				}
			})
		})

		//			收藏部分	
		$('.news_collect').click(function() {
			if(userId) {
				var collect = $(this).attr('data-collect')
				if(collect) {
					$.ajax({
						type: "get",
						url: config.data + "news/unCollect",
						async: true,
						data: {
							targetId: newsId,
							userId: userId,
							type: 1
						},
						success: function(data) {
							if(data.state) {
								$('.news_collect').css("background-image", "url(../../Public/image/shoucang.png)").attr('data-collect', '')
								mui.toast("取消收藏成功")
							} else {

							}
						}
					});

				} else {
					$.ajax({
						type: "get",
						url: config.data + "news/collect",
						async: true,
						data: {
							targetId: newsId,
							userId: userId,
							type: 1,
							sys: sys
						},
						success: function(data) {
							if(data.state) {
								$('.news_collect').css("background-image", "url(../../Public/image/yishoucang.png)").attr('data-collect', '1')
								mui.toast("收藏成功")
							} else {

							}
						}
					});

				}
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		//			收藏部分结束	

		//			点赞部分
		$('body').on('tap', '.thumbs', function() {
			if(userId) {
				var parentId = $(this).children('.thumb').attr("data-commentId")
				var t = $(this).children('.thumb')
				if(t.attr("data-state") == "1") {

					$.ajax({
						type: "get",
						url: config.data + "news/unlike",
						async: true,
						data: {
							"parentId": parentId,
							"userId": userId,
							"type": 12,
						},
						success: function(data) {

							if(data.state) {

								t.attr("data-state", "0")
								t.css("background-image", "url(../../Public/image/good.png)")
								t.siblings('.thumb_num').text(parseInt(t.siblings('.thumb_num').text()) - 1);
								mui.toast("取消点赞")

							} else {

							}
						}
					});

				} else {

					$.ajax({
						type: "get",
						url: config.data + "news/like",
						async: true,
						data: {
							"parentId": parentId,
							"userId": userId,
							"type": 12,
						},
						success: function(data) {

							if(data.state) {
								t.attr("data-state", "1")
								t.css("background-image", "url(../../Public/image/diangoodone.png)")
								t.siblings('.thumb_num').text(parseInt(t.siblings('.thumb_num').text()) + 1);
								mui.toast("点赞成功")
							} else {

							}
						}
					});
				}
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		//  点赞部分结束
		
		//保存图片开始
		$('body').on('longtap', 'img', function() {
			var picurl = $(this).attr("src");
		   saveImg(picurl);
		});
		
		
		$('body').on('tap','.mui-preview-header',function(){
          let num=$(".mui-preview-indicator").text();        
          num=num.substring(0,1)-1;
          let url=$(".mui-preview-image img:eq("+num+")").attr("src");
          saveImg(url);
		})
		
			
		function saveImg(picurl){
			var picname;
			var btnArray = ['否', '是'];
			mui.confirm('是否保存该图片？', 'ONE', btnArray, function(e) {
				if(e.index == 1){

					if(picurl.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
					{
						picname = picurl.substring(picurl.lastIndexOf("/") + 1, picurl.length);
					} else {
						picname = picurl;
					}
					savePicture(picurl, picname)
				}
			});
			
		}
		

// 保存图片到相册中 
        function savePicture(picurl, picname) {
	         // 创建下载任务
	         var dtask = plus.downloader.createDownload(picurl, {}, function(d, status) {
		// 下载完成
		         if(status == 200) {
			//			alert("Download success: " + d.filename);
			     plus.gallery.save(d.filename, function() {
				   mui.toast('保存成功');
			     }, function() {
				  mui.toast('保存失败，请重试！');
			     });
		     } else {
			    alert("Download failed: " + status);
		    }

	    });
	      //dtask.addEventListener( "statechanged", onStateChanged, false );
	       dtask.start();

        }


		//	滚动隐藏
		function scroll(fn) {
			var beforeScrollTop = document.body.scrollTop,
				fn = fn || function() {};
			window.addEventListener("scroll", function() {
				var afterScrollTop = document.body.scrollTop,
					delta = afterScrollTop - beforeScrollTop;

				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
				beforeScrollTop = afterScrollTop;
			}, false);
		}

		scroll(function(direction) {
			
			if(direction == "down") {
				$('.news_userInfo_reply').addClass('hidden')
			} else {
				document.body.scrollHeight - screen.height - document.body.scrollTop > 16 ? $('.news_userInfo_reply').removeClass('hidden') : ""

			}
		});

		//滚动隐藏结束

		$('.news_userInfo_replyInput').click(function() {
			$('.news_userInfo_reply').addClass('hidden')
			$('.news_secondComment').removeClass('hidden')
			$('.news_secondComment_input').focus()

			$('.news_secondComment_input').blur(function() {
				setTimeout(function() {
					$('.news_secondComment').addClass('hidden')
					$('.news_userInfo_reply').removeClass('hidden')
				}, 250)

			})
		})
		$('body').on('click', '.publish', function(event) {
			event.preventDefault();
			if(userId) {
				var content = $(this).prev().val();
//			    alert(content);
//				return false;
				if(content){
					$.ajax({
					   type: "get",
					   url: config.data + "news/comment",
					   async: true,
					   data: {
						  "targetCommentId": newsId,
						   "userId": userId,
						"series": 1,
						"content": content,
						"news_img": firstImg,
						"newsid": newsId,
						"news_title": title
					   },
					   success: function(data) {
						 if(data.state == "1") {
							
							$('.news_secondComment_input').val("");
			       //不刷新										
						 getComment();
						 mui.toast("发送成功");					
						} else {
							mui.toast("发送失败，请重试")
						}
					   }
				    });
				}else{
					mui.toast("请填写内容");
				}
				
			} else {
				mui.openWindow({
					url: "../user/login.html",
					id: "../user/login.html"
				})
			}

		})

		$('.news_review').click(function() {
			$('html, body').animate({
				scrollTop: $('#recommend').offset().top - (total_height + 36) + "px"
			}, 1000)
		})

	})
})

function getComment(){
	$.ajax({
			type: "get",
			url: config.data + "news/getHotNewsCommentByPage",
			async: true,
			data: {
				"commentParentId": newsId,
				"page": 0,
				"userId": userId
			},
			success: function(data) {
				if(data.state) {
					page=0;
					var com = data.comment;
					var comment = "";
					var towLen,portrait;
					for(var i = 0; i < com.length; i++) {
						var tow = com[i].towCommentList;
						var secondCom = "";
						if(com[i].state) {
							var ifGood = "good";
						} else {
							var ifGood = "noGood";
						}
						
						if(com[i].portrait==0||com[i].portrait==null){
							portrait="../../Public/image/morentouxiang.png";
						}else{
							portrait=com[i].portrait;
						}
						
						
						for(var j = 0; j < tow.length; j++) {
							var ifHide = tow[j].targetUserNickName || "hidden";
							secondCom +=
								"<div class='comment_secondComment '>" +
								"<span class='color_green'>" + tow[j].selfNickName + "</span>" +
								"<span class='" + ifHide + "' style='margin:0 0.4rem;'>回复</span>" +
								"<span class='color_green " + ifHide + "'>" + ifHide + "</span>" +
								"<span class='color_282828'>：" + tow[j].content + "</span>" +
								"</div>";
						}

						if(tow.length >= 2) {
							var secondComs =
								"<div class='comment_secondComments font_14 ofh'>" + secondCom +
								"<div class='more_secondComment color_green fr " + towLen + "' data-id='" + com[i].id + "' data-userId='" + com[i].user_id + "'>" +
								"全部回复" +
								"</div>" +

								"</div>";
						} else {
							var secondComs = "<div class='comment_secondComments font_14 ofh'>" + secondCom + "</div>";
						}

						comment +=
							"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");'></div>" +
							"<div class='news_post_commentContent_content fl'>" +
							"<div class='comment_user font_12'>" + com[i].nick_name + "</div>" +
							"<div class='comment_content font_14'>" + com[i].content + "</div>" +
							"<div class='comment_info ofh'>" +
							"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
							"<div class='fr color_9e9e9e comment_imgs'>" +
							"<div class='thumbs fl'>" +
							"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "' data-commentId='" + com[i].id + "'></span>" +
							"<span  class='thumb_num font_14'>" + com[i].agree + "</span>" +
							"</div>" +
							"<div class='comment_nums fl'>" +
							"<span class='comment_img' data-id='" + com[i].id + "' data-userId='" + com[i].user_id + "'></span>" +
							"<span class='comment_num font_14'>" + com[i].comment + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +
							secondComs +
							"</div>" +
							"</div>"
					};

					$('.news_post_commentContents').empty().append(comment)

					if($('.thumb').attr('data-state')) {
						$(this).css("background-image", "url(../../Public/image/diangoodone.png)")
					}
					if(com.length < 5) {

						mui('.new_post_contents').pullRefresh().endPullupToRefresh(true);

					} else {

						mui('.new_post_contents').pullRefresh().endPullupToRefresh(false);

					}

				} else {

				}
			}
		});
		
}



function up(){
	page++;
	if(type = "hot") {
		$.ajax({
			type: "get",
			url: config.data + "news/getHotNewsCommentByPage",
			async: true,
			data: {
				"commentParentId": newsId,
				"page": page,
				"userId": userId
			},
			success: function(data) {
				if(data.state) {
					var com = data.comment;
					var comment = "";
					var towLen,portrait;
					for(var i = 0; i < com.length; i++) {
						var tow = com[i].towCommentList;
						var secondCom = "";
						if(com[i].state) {
							var ifGood = "good";
						} else {
							var ifGood = "noGood";
						}
						
						if(com[i].portrait==0||com[i].portrait==null){
							portrait="../../Public/image/morentouxiang.png";
						}else{
							portrait=com[i].portrait;
						}
						
						
						for(var j = 0; j < tow.length; j++) {
							var ifHide = tow[j].targetUserNickName || "hidden";
							secondCom +=
								"<div class='comment_secondComment '>" +
								"<span class='color_green'>" + tow[j].selfNickName + "</span>" +
								"<span class='" + ifHide + "' style='margin:0 0.4rem;'>回复</span>" +
								"<span class='color_green " + ifHide + "'>" + ifHide + "</span>" +
								"<span class='color_282828'>：" + tow[j].content + "</span>" +
								"</div>";
						}

						if(tow.length >= 2) {
							var secondComs =
								"<div class='comment_secondComments font_14 ofh'>" + secondCom +
								"<div class='more_secondComment color_green fr " + towLen + "' data-id='" + com[i].id + "' data-userId='" + com[i].user_id + "'>" +
								"全部回复" +
								"</div>" +

								"</div>";
						} else {
							var secondComs = "<div class='comment_secondComments font_14 ofh'>" + secondCom + "</div>";
						}

						comment +=
							"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(portrait) + ");'></div>" +
							"<div class='news_post_commentContent_content fl'>" +
							"<div class='comment_user font_12'>" + com[i].nick_name + "</div>" +
							"<div class='comment_content font_14'>" + com[i].content + "</div>" +
							"<div class='comment_info ofh'>" +
							"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
							"<div class='fr color_9e9e9e comment_imgs'>" +
							"<div class='thumbs fl'>" +
							"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "' data-commentId='" + com[i].id + "'></span>" +
							"<span  class='thumb_num font_14'>" + com[i].agree + "</span>" +
							"</div>" +
							"<div class='comment_nums fl'>" +
							"<span class='comment_img' data-id='" + com[i].id + "' data-userId='" + com[i].user_id + "'></span>" +
							"<span class='comment_num font_14'>" + com[i].comment + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +
							secondComs +
							"</div>" +
							"</div>"
					};

					$('.news_post_commentContents').append(comment);
					var reviewNum=$('.news_post_commentContent').length;	
					if(reviewNum > 99) {
						reviewNum = 99
					}
					$(".news_reviewNum").text(reviewNum);
					

					if($('.thumb').attr('data-state')) {
						$(this).css("background-image", "url(../../Public/image/diangoodone.png)")
					}
					if(com.length < 5) {

						mui('.new_post_contents').pullRefresh().endPullupToRefresh(true);

					} else {

						mui('.new_post_contents').pullRefresh().endPullupToRefresh(false);

					}

				} else {

				}
			}
		});
	} else {
		
		$.ajax({
			type: "get",
			url: config.data + "news/getCommentByPage",
			async: true,
			data: {
				"commentParentId": newsId,
				"page": page,
				"userId": userId
			},
			success: function(data) {
				if(data.state) {
					var com = data.comment;
					var comment = "";
					var towLen
					for(var i = 0; i < com.length; i++) {
						var tow = com[i].towCommentList;
						var secondCom = "";
						if(com[i].state) {
							var ifGood = "good";
						} else {
							var ifGood = "noGood";
						}
						for(var j = 0; j < tow.length; j++) {

							var ifHide = tow[j].targetUserNickName || "hidden";
							secondCom +=
								"<div class='comment_secondComment '>" +
								"<span class='color_green'>" + tow[j].selfNickName + "</span>" +
								"<span class='" + ifHide + "' style='margin:0 0.4rem;'>回复</span>" +
								"<span class='color_green " + ifHide + "'>" + ifHide + "</span>" +
								"<span class='color_282828'>：" + tow[j].content + "</span>" +
								"</div>"
						}

						if(tow.length >= 2) {
							var secondComs =
								"<div class='comment_secondComments font_14 ofh'>" + secondCom +
								"<div class='more_secondComment color_green fr " + towLen + "' data-id='" + com[i].id + "' data-userId='" + com[i].user_id + "'>" +
								"全部回复" +
								"</div>" +

								"</div>";
						} else {
							var secondComs = "<div class='comment_secondComments font_14 ofh'>" + secondCom + "</div>";
						}
          
						comment +=
							"<div class='news_post_commentContent ofh' data-id='" + com[i].id + "'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(com[i].portrait) + ");'></div>" +
							"<div class='news_post_commentContent_content fl'>" +
							"<div class='comment_user font_12'>" + com[i].nick_name + "</div>" +
							"<div class='comment_content font_14'>" + com[i].content + "</div>" +
							"<div class='comment_info ofh'>" +
							"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
							"<div class='fr color_9e9e9e comment_imgs'>" +
							"<div class='thumbs fl'>" +
							"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "' data-commentId='" + com[i].id + "'></span>" +
							"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
							"</div>" +
							"<div class='comment_nums fl'>" +
							"<span class='comment_img' data-id='" + com[i].id + "' data-userId='" + com[i].user_id + "'></span>" +
							"<span class='comment_num font_14'>" + com[i].comment + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +
							secondComs +
							"</div>" +

							"</div>"
					};

					$('.news_post_commentContents').append(comment);
					var reviewNum=$('.news_post_commentContent').length;	
					if(reviewNum > 99) {
						reviewNum = 99
					}
					$(".news_reviewNum").text(reviewNum);
					

					if($('.thumb').attr('data-state')) {
						$(this).css("background-image", "url(../../Public/image/diangoodone.png)")
					}
					if(com.length < 5) {

						mui('.new_post_contents').pullRefresh().endPullupToRefresh(true);

					} else {

						mui('.new_post_contents').pullRefresh().endPullupToRefresh(false);

					}

				} else {

				}
			}
		});
	}

}

function down() {
	window.location.reload();
	setTimeout(function() {
		mui('#news_content').pullRefresh().endPulldown(true);
	}, 1000);

}