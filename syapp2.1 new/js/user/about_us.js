$(function(){
	mui.plusReady(function(){
		var backHeight = plus.navigator.getStatusbarHeight();
		var finalHeight = parseInt(backHeight) + 11 + "px";
		$('.back').css('top',finalHeight)
		
	})
	$('.back').click(function(){
		mui.back()
	});
	mui.plusReady(function(){
	    plus.runtime.getProperty(plus.runtime.appid,function(inf){
             $('.version').text(`版本 : ${inf.version}`);
        });
    })
})
