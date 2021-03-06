var val="";
$(function(){
	$('body').on('input', 'input[type=text],.search_bar', function() {
		val = $('.search_bar').val().replace(/[&\|\\\*^%$#@\-]/g,"");
		$('.search_lists').children().remove();
		if(val){
			pages = 1
			$.ajax({
				type:"get",
				url:config.data + "news/searchNewsByGameName",
				async:true,
				timeout:20000,
				data:{
					sys:2,
					msg:val,
					page:1
				},
				success:function(data){	
					$('.error').html("");				
					if (data.state > 0) {		
						var  div = '';
						var g = data.newsList;
						if (g.length > 0) {
							for (var i = 0; i < g.length; i++) {
								div+=
							    "<div class='search_list font_12 simHei' data-id='"+ g[i].id +"'>"+									
									"<div class='fl overflow' style='margin-left: 1rem; width: 24em;'>"+ g[i].title +"</div>"+
								"</div>"
							}
							$('.search_lists').empty().append(div);		
						}
						
					} else{
						var no_content = "<div class='no_content tac'>没有搜到任何内容</div>"
						$('.search_lists').empty().append(no_content)
					}
				},
				error:function(){
					var errorHTML="<div style='margin-top:10rem'><img style='width:138px;height:180px;display:block;margin:0 auto;' src='../../Public/image/notonline.png' /></div>";
       	            $('.error').html(errorHTML);
				}
			});
		}
	})
	$('body').on('tap','.search_list',function(){
		mui.openWindow({
			url:"news_post.html",
			id:"news_post.html",
			extras:{
				newsId:$(this).attr('data-id')
			}
		})
	})
	
	$('body').on('tap','.search_img',function(){
		var id=$('.search_list:first').attr('data-id');
		if(id){
			mui.openWindow({
			   url:"news_post.html",
			   id:"news_post.html",
			   extras:{
				newsId:id
			   }
		    })
		}else{
			if(val==""){
				mui.toast("请输入搜索内容")
			}		
		}
		
	});
	
})
