var icon;
var gameName;
var gameId;
var gameComment = false;
var gameStrategy = false;
var commentModule = false;
var userId = localStorage.getItem("userId");
var game;
$(function() {

	mui.plusReady(function() {
		mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
		$('.header_box').next().css("margin-top", 0 + "px");
		$('.backImg').css("top", total_height - 36.5 + "px");
		var self = plus.webview.currentWebview();
		gameId = self.gameId;

		$.ajax({
			type: "get",
			url: config.data + "game/getGameById",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					game=data.gameDetail;
					var  g = data.gameDetail;

					var icon_img = g.game_title_img;
					icon = icon_img;
					var game_name = g.game_name;
					gameName = game_name;
					$('.game_detailTopimg').css('background-image', 'url(' + config.img + encodeURI(g.game_title_img) + ')');
					$('.game_infoImg').css('background-image', 'url(' + config.img + encodeURI(g.icon) + ')');
					$('.game_call').text(g.game_name);
					$('.game_nameHeader').text(g.game_name);
					$('.game_company').text(g.game_company);
					$('.game_infoScore').text(g.grade + "分");
					$('.gameScore').text(g.grade)
					if(g.tagList) {
						var t = g.tagList.split(',');
						for(var i = 0; i < t.length - 1; i++) {
							var sp = "<span class='color_green'>" + t[i] + "  |</span>"

						}
						$('.game_signs').append(sp)
						var spLast = "<span class='color_green'>" + t[t.length - 1] + "</span>"
						$('.game_signs').append(spLast)

					}

					$('.game_simpleIntro_content').html(g.game_detail)
					$('.game_particular_value').children().eq(0).text(g.game_download_num + "次下载")
					$('.game_particular_value').children().eq(1).text(g.game_version)
					$('.game_particular_value').children().eq(2).text(g.game_size + "MB")
					$('.game_particular_value').children().eq(3).text(g.game_update_date)
					$('.game_particular_value').children().eq(4).text(g.game_company)
					$('.game_particular_value').children().eq(5).text(g.game_company)
					$.ajax({
						type: "get",
						url: config.data + "game/getGameImgListById",
						async: true,
						data: {
							gameId: gameId
						},
						success: function(data) {
							if(data.state) {
								var gl = data.gameList
								var div = ''
								for(var i = 0; i < gl.length; i++) {
									div +=
										"<div style='margin:0.625rem 0.625rem;margin-left: 0;margin-top: 0.125rem;'>" +
										"<img class='game_detail_content' src='"+ config.img + encodeURI(gl[i].img_src) +"' data-preview-src='' data-preview-group='2' />"+
//										"<img class='game_detail_content' style='background-image: url(" + config.img + encodeURI(gl[i].img_src) + ");'></img>" +
										"</div>"
								}
								$('.game_detail_contents').append(div)
							} else {

							}
						}
					});
				} else {

				}
			}

		});

		//		相关资讯
		$.ajax({
			type: "get",
			url: config.data + "game/getNewsByGameId",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					var nl = data.newsList;
					var div = '';
					for(var i = 0; i < nl.length; i++) {
						div +=
							"<div class='game_relatedInfocontent' data-id='" + nl[i].id + "'>" +
							"<div class='game_relatedInfocontentImg' style='background-image: url(" + config.img + encodeURI(nl[i].img) + ");'></div>" +
							"<div class='game_relatedInfocontentArt font_14 simHei color_282828'>" + nl[i].title + "</div>" +
							"<div class='game_relatedInfocontentTime font_12 simHei color_9e9e9e'>" + nl[i].add_time + "</div>" +
							"</div>"
					}
					$('.game_relatedInfocontents').append(div)

				} else {

				}
			}
		});

		$('body').on('click', '.game_relatedInfocontent', function() {
			mui.openWindow({
				url: "../news/news_post.html",
				id: "../news/news_post.html",
				extras: {
					newsId: $(this).attr('data-id'),
					gameId: gameId
				}
			})
		})

		//		相关资讯结束

		//		游戏热评部分
		$.ajax({
			type: "get",
			url: config.data + "game/getGameHotComment",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {

					var com = data.comment;
					var div = '';

					for(var i = 0; i < com.length; i++) {
						if(com[i].state) {
							var ifGood = "good";
						} else {
							var ifGood = "noGood";
						}
						div +=
							"<div class='news_post_commentContent ofh'>" +

							"<div class='ofh'>" +
							"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(com[i].portrait) + ");' ></div>" +
							"<div class='comment_user font_12 font_bold fl'>" + com[i].nick_name + "</div>" +

							"</div>" +
							"<div class='game_comment_content'>" +
							"<div class='comment_content font_14' data-id='" + com[i].id + "'>" + com[i].content + "</div>" +
							"<div class='comment_info ofh'>" +
							"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
							"<div class='fr color_9e9e9e comment_imgs'>" +
							"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "'></span>" +
							"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
							"<span class='comment_img' data-id='" + com[i].id + "'></span>" +
							"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
							"</div>" +
							"</div>" +
							"</div>" +

							"</div>"
					}
					$('.news_post_commentContentshot').append(div)
				} else {

				}
			}
		});

		//		游戏热评部分结束

		//		相关游戏

		$.ajax({
			type: "get",
			url: config.data + "game/getGameLikeTag",
			async: true,
			data: {
				gameId: gameId
			},
			success: function(data) {
				if(data.state) {
					var gl = data.gameList;
					var div = '';
					for(var i = 0; i < gl.length; i++) {
						div +=
							"<div>" +
							"<div class='game_similarContent backgroundColor_white ofh' data-id='" + gl[i].id + "'>" +
							"<div class='game_similarContentimg' style='background-image: url(" + config.img + encodeURI(gl[i].icon) + ");' ></div>" +
							"<div class='game_similarContentname font_12 font_bold color_282828'>" + gl[i].game_name + "</div>" +
							"<div class='game_similarContentinfo ofh'>" +
							"<div class='font_12 color_7a7a7a fl' style='margin-left: 0.4375rem;'>" + gl[i].tagList + "</div>" +
							"<div class='fr font_12 color_7a7a7a' style='margin-right: 0.5rem;'>" + gl[i].grade + "分</div>" +
							"<div class='game_star fr'></div>" +
							"</div>" +
							"</div>" +
							"</div>"
					}
					$('.game_similarContents').append(div)
				} else {

				}
			}
		});

		$('body').on('click', '.game_similarContent', function() {

			mui.openWindow({
				url: 'game_detail.html',
				id: 'game_detail.html',
				extras: {
					gameId: $(this).attr('data-id')
				},
				createNew: true //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			})
		})

		//		相关游戏结束

		$('.goToscore').click(function() {
		if (localStorage.getItem("userId")) {
			mui.openWindow({
				url: "game_score.html",
				id: "game_score.html",
				extras: {
					gameId: gameId,
					icon: icon,
					gameName: gameName
				}
			})
		} else{
			mui.openWindow({
				url:"../user/login.html",
				id:"../user/login.html"
			})
		}
			
		})
		
//		详情页夜夜夜夜


		$('.game_detail_detail').click(function() {
			commentModule = false;
			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
			$(this).addClass('game_detail_detail_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_assess_active').removeClass('game_detail_strategy_active')
			$('.game_detail_details').removeClass('hidden').siblings('div').addClass('hidden');

		})
		
		
//		详情页结束


//		评论页开始


		$('.game_detail_assess').click(function() {
			mui('#game_detailContent').pullRefresh().enablePullupToRefresh();
			$('.news_post_commentContents').children().remove()
			commentModule = true;

			$(this).addClass('game_detail_assess_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_strategy_active')
			$('.game_detail_comments').removeClass('hidden').siblings('div').addClass('hidden');
			
			$.ajax({
				type:"get",
				url:config.data + "game/getGameCommentScore",
				async:true,
				data:{
					gameId:gameId
				},
				success:function(data){
					if (data.state) {
						var s =  data.scoreList;
						var total = 0;
						var arr=[];
						for (var i = 0; i < s.length; i++) {
							arr.push(parseInt(s[i].num))
							total += s[i].num
							
						}
						
						for (var j = 0; j < arr.length; j++) {
							
							
							$(".bar" + j).css('width',arr[j]/total * 10 +"rem" )
						}
						
					} else{
						
					}
				}
			});
			
			//		获取游戏评论
//			if(!gameComment) {

				gameComment = true;
				$.ajax({
					type: "get",
					url: config.data + "game/getGameCommentById",
					async: true,
					data: {
						gameId: gameId,
						page: 1,
					},
					success: function(data) {
						if(data.state) {

							var com = data.comment;
							var div = '';

							for(var i = 0; i < com.length; i++) {
								if(com[i].state) {
									var ifGood = "good";
								} else {
									var ifGood = "noGood";
								}
								div +=
									"<div class='news_post_commentContent ofh'>" +

									"<div class='ofh'>" +
									"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(com[i].portrait) + ");' ></div>" +
									"<div class='comment_user font_12 font_bold fl'>" + com[i].nick_name + "</div>" +

									"</div>" +
									"<div class='game_comment_content'>" +
									"<div class='comment_content font_14' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'>" + com[i].content + "</div>" +
									"<div class='comment_info ofh'>" +
									"<div class='font_12 color_9e9e9e fl'>" + com[i].add_time + "</div>" +
									"<div class='fr color_9e9e9e comment_imgs'>" +
									"<span class='thumb " + ifGood + "' data-state='" + com[i].state + "'></span>" +
									"<span class='thumb_num font_14'>" + com[i].agree + "</span>" +
									"<span class='comment_img' data-id='" + com[i].id + "' data-uid ='" + com[i].uid + "'></span>" +
									"<span class='comment_num font_14'>" + com[i].comment_num + "</span>" +
									"</div>" +
									"</div>" +
									"</div>" +

									"</div>"
							}
							$('.news_post_commentContents').append(div)

						} else {

						}
					}
				});
//			}

			//		获取游戏评论结束

		})
		
		
//		评论页结束		



//		攻略页开始

		$('.game_detail_strategy').click(function() {
			$('.news_post_commentContents').children().remove()
			commentModule = false;
			mui('#game_detailContent').pullRefresh().disablePullupToRefresh();
			$(this).addClass('game_detail_strategy_active').removeClass('color_c9c9').siblings('div').addClass('color_c9c9').removeClass('game_detail_detail_active').removeClass('game_detail_assess_active')
			$('.game_detail_walkThroughs').removeClass('hidden').siblings('div').addClass('hidden');
			//		获取游戏攻略
			$.ajax({
				type:"get",
				url:config.data + "game/getStrategyByGameName",
				async:true,
				data:{
					gameName:gameName,
					page:1
				},
				success:function(data){
					if (data.state) {
						var str = data.strategy;
						var div ='';
						if (str.length > 0) {
							for (var i = 0; i < str.length; i++) {
								if (str[i].src) {
									var src = "src"
								} else{
									var src = "hidden"
								}
								div+=
									"<div class='news_post_commentContent ofh' data-id='"+ str[i].id +"'>"+
	
										"<div class='ofh'>"+
											"<div class='news_post_commentContent_head fl' style='background-image: url(" + encodeURI(str[i].portrait) + ");' ></div>"+
											"<div class='comment_user font_14 font_bold fl'>"+ str[i].nick_name +"</div>"+
		
										"</div>"+
										"<div class='game_comment_content'>"+
											"<div class='font_bold color_282828' style='margin-top: 0.625rem;margin-bottom: 0.5625rem;'>"+
												"<span>"+ str[i].title +"</span>"+
												
											"</div>"+
											"<div class='font_14 overflow_two color_7a7a7a simHei'>"+ str[i].detail +"</div>"+
											"<img class='game_strategyImg "+ src +"' src='"+ config.img + str[i].src +"'/>"+
											"<div class='comment_info ofh'>"+
												"<div class='font_12 color_9e9e9e fl'>"+ str[i].add_time +"</div>"+
												"<div class='fr color_9e9e9e comment_imgs'>"+
													"<span class='thumb'></span>"+
													"<span class='thumb_num font_14'>"+ str[i].agree_num +"</span>"+
													"<span class='comment_img'></span>"+
													"<span class='comment_num font_14'>"+ str[i].comment_num +"</span>"+
												"</div>"+
											"</div>"+
										"</div>"+
		
									"</div>"
					
							}
							$('.news_post_commentContents').append(div)
						} else{
							$('.no_strategy').removeClass('hidden')
						}
						
					} else{
						
					}
				}
			});
			//		获取游戏攻略结束
			
			
			$('body').on('click','.news_post_commentContent',function(){
				var strategyId = $(this).attr("data-id");
				mui.openWindow({
					url:"../strategy/strategy_details.html",
					id:"../strategy/strategy_details.html",
					extras:{
						strategyId:strategyId
					}
				})
			})
		})
		

		
//		攻略页结束

		$("#game_detail_download").click(function(ev) {
			//	plus.downloader.clear(  );
			
			event = ev || window.event;
			event.stopPropagation();
			var t = $(this);
			var isFile = false;
			var fileName = '_downloads/' + game.game_name + '.apk';
			plus.downloader.startAll();
			switch($(this).find(".download_btn_text").text()) {
				case "下载":
					createDownload(game.game_name, game.game_download_andriod)
					//				t.text('暂停');
					break;
				case "打开":
					launchApp(game.game_packagename);
					//launchApp(myApp[1].packageName);
					break;
					//				t.launchApp();
				case "取消":
	//				console.log(1)
					plus.downloader.enumerate(function(tasks) {
						//		var state;
						for(var i = 0; i < tasks.length; i++) {
							if(tasks[i].filename == fileName) {
								tasks[i].abort();
							}
						}
					});
					setTimeout(function(){
						$(".download_btn_text").text("下载");
					$("#game_detail_download").removeClass("download_btn_active");
					$("#loading").css("width", 0+"%");
					mui.toast('下载任务已取消');
					},300)
								
					break;
				case "安装":
					installApp(fileName)
					break;
			}
		})


	})
	
	


	$('.backImg').click(function() {
		mui.back()
	})
	$('.comment_content').each(function() {
		var maxWidth = 10;
		if($(this).text().length > maxWidth) {
			$(this).text($(this).text().substring(0, maxWidth));
			$(this).html($(this).html() + "<span class='color_green' style='margin-left:0.2rem;' >详细</span>")
		}
	})

	$(window).scroll(function() {
		var $body = $('body');
		var windowWidth = $(window).width();
		var imgHeight = (0.66 * windowWidth - total_height);
		var setCoverOpacity = function() {
			$body.find('#header').css({
				opacity: ((($body.scrollTop() / imgHeight) > 1) ? 1 : ($body.scrollTop() / imgHeight))
			})
			$body.find('.before_header').css({
				opacity: ((($body.scrollTop() / imgHeight) > 1) ? 1 : ($body.scrollTop() / imgHeight))
			})
		}

		//初始化设置背景透明度 
		setCoverOpacity();
		//监听滚动条事件，改变透明度 
		$(window).scroll(function() {
			setCoverOpacity();
		});
		if($body.scrollTop() >= imgHeight + 106) {
			$('.download').removeClass('hidden')
			$('.border').removeClass('hidden')
			$('.game_detail_nav').css({
				"position": "fixed",
				"top": total_height,
				"border-bottom": "1px solid #E7EAEC"
			});

		} else {
			$('.download').addClass('hidden')
			$('.border').addClass('hidden')
			$('.game_detail_nav').css({
				"position": "static",
				"border-bottom": "0.5rem solid #E7EAEC"
			})
		}
	})

	$('.show_all').click(function() {
		$('.game_simpleIntro_content').removeClass('overflow_two')
		$(this).remove()
	})

	$('body').on('click', '.comment_img,.comment_content', function() {

		mui.openWindow({
			url: "game_allComments.html",
			id: "game_allComments.html",
			extras: {
				commentId: $(this).attr('data-id'),
				gameId: gameId,
				uid: $(this).attr('data-uid')
			}
		})
	})

	//	游戏点赞

	$('body').on('click', '.thumb', function() {
		var ts = $(this);
		if(ts.attr('data-state') !== 'null' && ts.attr('data-state')) {
			ts.css('background-image', 'url("../../Public/image/good.png")')
			ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) - 1)
			ts.attr('data-state', 'null')

			$.ajax({
				type: "get",
				url: config.data + "game/unLikeComment",
				async: true,
				data: {
					commentId: ts.siblings('.comment_img').attr('data-id'),
					userId: userId
				},
				success: function(data) {
					if(data.state) {

						mui.toast("取消点赞成功")

					} else {
						mui.toast("取消点赞失败，请重试")
					}
				}
			});
		} else {
			ts.css('background-image', 'url("../../Public/image/diangoodone.png")')
			ts.siblings('.thumb_num').text(parseInt(ts.siblings('.thumb_num').text()) + 1)
			ts.attr('data-state', 1)
			$.ajax({
				type: "get",
				url: config.data + "game/likeComment",
				async: true,
				data: {
					commentId: ts.siblings('.comment_img').attr('data-id'),
					userId: userId
				},
				success: function(data) {

					if(data.state) {
						mui.toast("点赞成功")

					} else {
						mui.toast("点赞失败，请重试")
					}
				}
			});
		}
	})

	//	游戏点赞结束

	
})


function createDownload(name, src) {
//		plus.downloader.clear();
//		return

		$.ajax({
			type:"get",
			url:config.data+"game/addDownloadNum",
			async:true,
			data:{id:self.gameId},	
			success:function(data){
				if(data.state){
					$("#game_msg_install").text(parseInt($("#game_msg_install").text())+1)
				}
			}
		});
	plus.downloader.enumerate(function(tasks) {
		for(var i = 0; i < tasks.length; i++) {
		
			if(tasks[i].filename == '_downloads/' + name + '.apk') {
//				tasks[i].abort();
				
				return;
				
			}
			
		}
		
		mui.toast("开始下载")
		$(".download_btn_text").text("取消");
		var dtask = plus.downloader.createDownload("http://apk.oneyouxi.com.cn/" + encodeURI(src), {
			method: 'GET',
			data: '',
			filename: '_downloads/' + name + '.apk',
			timeout: '3000',
			retry: 0,
			retryInterval: 0
		}, function(d, status) {
			// 下载完成
			
			if(status == 200) {

//				添加到我的游戏
				if(userId){	
					$.ajax({
						type:"get",
						url:config.data + "game/addMyGame",
						async:true,
						data:{
							gameId:gameId,
							userId:userId,
							sys:2
						},
						success:function(data){
							if (data.state) {
								
							} else{
								
							}
						}
					});
				}

//				添加我的游戏结束
				
				plus.runtime.install(dtask.filename, {}, function(widgetInfo) {
					//				console.log(widgetInfo)
					$(".download_btn_text").text("打开");
				}, function(error) {
					console.log(error)
				});

			} else {
				mui.toast("下载失败: " + status);
				$("#game_detail_download").removeClass("download_btn_active");
			}
		});
		dtask.addEventListener("statechanged", onStateChanged, false);
		dtask.start();
	});
}

function onStateChanged(download, status) {
//	if(download.state==5){
//		console.log(download.state)
//	}

	downloding(download)
	if(download.state == 4 && status == 200) {
		// 下载完成 
		$("#game_detail_download").removeClass("download_btn_active");
		$(".download_btn_text").text("安装");
		console.log("Download success: " + download.filename);

	}
}

function downloding(download) {
	switch(download.state) {
		case 0:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 1:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 2:
			//			$(".ldownload_btn_text").text('等待');
			break;
		case 3:
			loading((download.downloadedSize / download.totalSize * 100).toFixed(0))
			
			break;
		case 4:
			//			$(".ldownload_btn_text").text("打开");
			loading(0)
			break;
	}
}

function loading(num) {
//	!$("#game_detail_download").hasClass("download_btn_active") ? $("#game_detail_download").addClass("download_btn_active") : "";
	
	$(".download_loading").css("width", num+"%");
	
}



function installApp(filename) {
	plus.runtime.install(filename, {}, function(widgetInfo) {

		console.log(widgetInfo)

	}, function(error) {
		mui.toast("打开失败")
		console.log(error)

	});
}

function launchApp(pagename) {
	if(plus.os.name == "Android") {
		plus.runtime.launchApplication({
			pname: pagename,
			extra: {
				url: "http://www.html5plus.org"
			}
		}, function(e) {
			installApp('_downloads/' + game.game_name + '.apk')
		});
	} else if(plus.os.name == "iOS") {
		plus.runtime.launchApplication({
			action: "http://www.html5plus.org"
		}, function(e) {
			alert("Open system default browser failed: " + e.message);
		});
	}
}
