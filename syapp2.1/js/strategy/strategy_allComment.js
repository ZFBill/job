var commentId;
var firstUserid;
$(function(){
	mui.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		commentId = self.commentId;
		
		$.ajax({
			type:"get",
			url:config.data + "strategy/getCommentById",
			async:true,
			data:{
				commentId:commentId
			},
			success:function(data){
				if (data.state) {
					
					var com = data.comment;
					firstUserid = com.user_id;
//					$('.news_post_commentContent  .news_post_commentContent_head').CSS('background-image',)
					$('.comment_user').text(com.nick_name)
					$('.comment_content').text(com.content)
					if (com.img) {
						$('.allCom_img').attr('src',config.img + encodeURI(com.img))
					} else{
						$('.allCom_img').addClass('hidden')
					}
					
					$('.date').text(com.add_time)
					$('.news_post_commentContent_head').css("background-image", "url(" + encodeURI(com.portrait) + ")")
				} else{
					
				}
			}
		});
		
		
		$('.publish').click(function(){
			var content = $(this).siblings('.news_secondComment_input').val();
			if (content) {
				$.ajax({
					type:"get",
					url:config.data + "strategy/strategyComment",
					async:true,
					data:{
						userId:userId,
						content:content,
						targetCommentId:commentId,
						targetUserId:firstUserid,
						series:2
					},
					success:function(data){
						if (data.state) {
							mui.toast("发送成功")
							window.location.reload()
							
						} else{
							mui.toast("发送失败，请重试")
						}
					}
					
				});	
			} else{
				mui.toast("发送内容不能为空")
			}
		})
		
	})
})
