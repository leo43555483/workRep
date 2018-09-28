$(function(){
	$('.menu_btn').click(function(){
		$('.container').toggleClass('container_pull');
	})


	//bootstrap
	$('.container').addClass('container-fluid').removeClass('container');

	

	$(document).on('mouseover','.operatebtn',function(){
		$(this).addClass('operatebtn_on');
	}).on('mouseout','.operatebtn',function(){
		$(this).removeClass('operatebtn_on');
	});

	$(".customSelect_out select").SumoSelect();
	$(".input_check, .input_radio").iCheck({
		checkboxClass: "icheckbox_square-blue",
		radioClass: "iradio_square-blue"
	});
})


function submitForm(form,successCallback,errorCallback)
{
	$.ajax({
		type:"POST",
		dataType:"json",
		url:$(form).attr('action'),
		data:$(form).serialize(),
		beforeSend:function()
		{
			$(form).find(':submit').attr('disabled', 'disabled');
			$(form).find(':submit').val(_preservation + '...');
		},
		complete: function() {
		
			$(form).find(':input,textarea').removeAttr('disabled');
			$(form).find(':submit').val(_confirmation);
		},
		success:function(data){
			if (data.error == 0) {
				successCallback(data);
				commonAjaxSuccess(data);
			} else if(typeof(errorCallback) != 'undefined'){
				 errorCallback(data);
			} else {
				 commonAjaxOther(data);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
		  commonAjaxError(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}
function deleteAjax(message,url,successCallback)
{
	layer.confirm(message, {
		btn: ['确定','取消'] //按钮
	}, function(){
		layer.closeAll();
		$.ajax({
			type:"get",
			dataType:"json",
			url:url,
			data:{m:Math.random()},
			success:function(data){
				successCallback(data);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
			  commonAjaxError(XMLHttpRequest, textStatus, errorThrown);
			}
		});
	}, function(){
		
	});
	
}
function commonAjaxSuccess(data)
{
	$.colorbox.close();
}

function commonAjaxOther(data)
{
	layer.alert(_thereIsAnUnknownErrorPleaseTryAgainLater, {
		icon: 2,
		skin: 'layer-ext-moon'
	});
}

function commonAjaxError(XMLHttpRequest, textStatus, errorThrown)
{
	layer.alert(_thereIsAnUnknownErrorPleaseTryAgainLater, {
		icon: 2,
		skin: 'layer-ext-moon'
	});
}

function getfilesize(size) {
	if (!size)
		return "";

	var num = 1024.00; //byte

	if (size < num)
		return size + "B";
	if (size < Math.pow(num, 2))
		return (size / num).toFixed(2) + "K"; //kb
	if (size < Math.pow(num, 3))
		return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
	if (size < Math.pow(num, 4))
		return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
	return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}