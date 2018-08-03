var clsId;
var page = 0;
var name;
$(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		clsId = self.clsId;
		name = self.name;
		$('.game_nameHeader').text(name)
	})
	
	$('body').on('tap','.game_list',function(){
		mui.openWindow({
			url:"game_detail.html",
			id:"game_detail.html",
			extras:{
				gameId:$(this).attr('data-id')
			}
		})
	})
	
	$('body').on('tap','.tag',function(e){
		e.stopPropagation()
		tagId = $(this).attr('data-id');
		tagName = $(this).text();
       mui.openWindow({
			url: "game_classify_list.html",
			id: "game_classify_list.html",
			extras: {
				tagId: tagId,
				tagName: tagName
			}
		})
	});
})
