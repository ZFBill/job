$(function() {
	$('body').on('input', 'input[type=text],.search_bar', function() {
		$('.search_lists').children().remove()
		var content = $('.search_bar').val()
		if(content) {
			
			$.ajax({
				type: "get",
				url: config.data + "strategy/getStrategyGameNameByMsg",
				async: true,
				data: {
					msg: content
				},
				success: function(data) {
					$('.error').html("");
					if(data.gameName.length!=0&&data.state) {					
						var gn = data.gameName;
						var div = '';
						for(var i = 0; i < gn.length; i++) {
							div +=
								"<div class='search_list' data-id='"+gn[i].id+"'>" 
								+"<div class='fl' style='margin:0 0.5rem 0 1rem;'>"+gn[i].game_name+" :"+"</div>"+
								"<div class='fl searchTitle' >" + gn[i].title + "</div>" +
								"</div>"
						}
						$('.search_lists').append(div)
					} else {
                        var no_content = "<div class='no_content tac'>没有搜到任何内容</div>"
						$('.search_lists').append(no_content)
					}
				},
				error:function(){
				    var errorHTML="<div style='margin-top:11rem'><img style='width:138px;height:180px;display:block;margin:0 auto;' src='../../Public/image/notonline.png' /></div>";
       	            $('.error').html(errorHTML);
				}
			});
		}
	})

	$("body").on('tap','.search_list',function(){
		var id = $(this).attr("data-id");
		mui.openWindow({
			url:"strategy_details.html",
			id:"strategy_details.html",
			extras:{
				strategyId:id
			}
		})
	})
	
	$('.search_img').click(function(){
		var id = $('.search_list:first').attr("data-id");
		if (id) {
			mui.openWindow({
				url:"strategy_details.html",
			    id:"strategy_details.html",
			    extras:{
				   strategyId:id
			    }
			})
		} else{
			mui.toast("内容不能为空")
		}
	})
	
})