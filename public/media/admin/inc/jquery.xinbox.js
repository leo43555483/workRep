(function($){
	$.fn.xinBox = function(options){
		var defaults = {

			widthpercent:0.50,	//只能用 0-1之间，其他的都转为0.8， 见17行左右
			maxWidth:800,
			minWidth:320,
			innerWidth:320,
			//innerHeight:1000,
			positionRight:50,
			mouseWheelSpeed:60,
			defaultHref: false,
			opacity:.5
		},
		options = $.extend(defaults, options),
		ifmaxWidth,
		contentWidth,
		isIE = $.support.msie && !$.support.opacity, // feature detection alone gave a false positive on at least one phone browser and on some development versions of Chrome.
		isIE6 = isIE && $.support.version < 7;

		var winWidth = window.innerWidth ? window.innerWidth : $(window).width();
		var winHeight = window.innerHeight ? window.innerHeight : $(window).height();
		
		//options.href = options.href || $(element).attr('href');


		if(! $('.xinsidebox').length > 0){
			$("body").append('<div class="xinsidebox"><div class="xboxOverlay"></div><div class="xboxWrapper"><div class="xboxClose"></div><div class="xboxContent"><div class="xboxLoadedContent"><div class="xboxHeader"></div><div class="xboxArticle"><div class="pageloadingbox cssload-spin-box"></div></div><div class="xboxFooter"></div></div></div></div></div>');
		}


		
		if(options.widthpercent > 1 || options.widthpercent < 0 || isNaN(options.widthpercent)){	options.widthpercent = 0.8	}
		
		var resizefun = function(){
			winWidth = window.innerWidth ? window.innerWidth : $(window).width();
			winHeight = window.innerHeight ? window.innerHeight : $(window).height();
			ifmaxWidth = ( $(window).width() * options.widthpercent ) > options.maxWidth ? options.maxWidth : ( $(window).width() * options.widthpercent )
			contentWidth = ifmaxWidth < options.minWidth ? options.minWidth : ifmaxWidth;
			$('.xboxArticle').height(winHeight - ($('.xboxHeader').is(':hidden')? '0' : $('.xboxHeader').outerHeight()));
			//$('.xboxOverlay').height($(window).height() + 100).width($(window).width()).css('opacity',options.opacity);

			$('.xboxWrapper').width( $(window).width() < 768 ? $(window).width() : contentWidth );
			$('.xboxWrapper').css({
				'right': 0
			});
				//console.log(winWidth + '/'+ $('.xboxWrapper').width())
		}
		resizefun()
		$(window).resize(function(){
			resizefun()
		});

		if (isIE6) {
			var scrollfun = function(){
				$('.xinsidebox').css({"top":$(window).scrollTop()})
			}
			scrollfun();
			$(window).scroll(function(event) {
				scrollfun();
			});
		}
		

		$(window).bind('resize.xinBox', defaults.reposition);


		/*var ajaxapi = $('.xboxArticle').jScrollPane({
			autoReinitialise: true,
			//animateScroll: true,
			//maintainPosition:false,
			mouseWheelSpeed: options.mouseWheelSpeed,
			horizontalGutter: 30,
			showArrows:true
		}).data('jsp');*/

		
		if(! options.defaultHref == false){
			$('.pageloading').fadeIn();

			$('.xinsidebox').show();
			setTimeout(function(){
				$('body').css({'overflow':'hidden'});
				$('.xboxOverlay').fadeIn();
				$('.xboxWrapper').show().css({'transform':'translate(50%,0)','opacity':'0'});
				$('.xboxWrapper').animate({
					//'transform':'translate(0%,0%)',
					'opacity':'1'

				},{
					step: function (now, fx) {
						$(this).css({"transform": "translate(0%,0)"});
					},
					duration: 0,
					easing: 'linear',
					queue: false,
					complete: function () {
						//alert('Animation is done');
					}
				}, 'linear');
			},100);
			var loadurl = options.defaultHref;
			setTimeout(function(){
				$('.xboxArticle').load(loadurl,function(){
					$('.jspPane').css({'opacity':'0'});
					$('.jspPane').animate({'opacity':'1'});
					//ajaxapi.scrollTo(0,0);

					$('.pageloading').fadeOut();
				});

				/*$('.xboxHeader').load(loadurl + ' .detail_tit .tit',function(){
					
				});*/
			},600)
		}else{
		}


		$(this).on('click', function(e){
			return false;
		}).on('mousedown', function(e){
			if(3 == e.which){
				return false;
			}
			
			$('.pageloading').fadeIn();

			//添加#id-1标识
			window.location.hash= encodeURI(this.href);
			$('.xinsidebox').show();
			setTimeout(function(){
				$('body').css({'overflow':'hidden'});
				$('.xboxOverlay').fadeIn();
				$('.xboxWrapper').show().css({'transform':'translate(50%,0)','opacity':'0'});
				$('.xboxWrapper').animate({
					//'transform':'translate(0%,0%)',
					'opacity':'1'
				},{
					step: function (now, fx) {
						$(this).css({"transform": "translate(0%,0)"});
					},
					duration: 0,
					easing: 'linear',
					queue: false,
					complete: function () {
						//alert('Animation is done');
					}
				}, 'linear');
			},100);
			var loadurl = this.href;
			setTimeout(function(){
				$('.xboxArticle').load(loadurl,function(){
					$('.jspPane').css({'opacity':'0'});
					$('.jspPane').animate({'opacity':'1'});
					//ajaxapi.scrollTo(0,0);

					$('.pageloading').fadeOut();
				});
				/*$('.xboxHeader').load(loadurl + ' .detail_tit .tit',function(){
					
				});*/
			},400)
			return false;
		});

		
		
		$(document).on('click','.xboxOverlay, .xboxClose, .xboxClose_btn', function(){
			$('body').css({'overflow':'auto'});
			$('.xboxOverlay').fadeOut('fast');
			$('.xboxWrapper').fadeOut('fast',function(){
				$('.xinsidebox').hide();
				$('.xboxWrapper').hide().css({'transform':'translate(100%,0)'});
				//$("body").css("overflow","auto");
			});
			setTimeout(function(){
				$('.xboxArticle').html('<div class="pageloadingbox cssload-spin-box"></div>');
			},500)
			
			//取消#id-1 标识
			var st = parseInt($(window).scrollTop());
			window.location.hash='';
			$('html,body').scrollTop(st);
		});

		$('.xboxArticle').bind('jsp-scroll-y',function(event, scrollPositionY){
			$('.popnav').css({'marginTop':scrollPositionY})
		});
		/*$('.xboxArticle').bind('jsp-scroll-y',function(event, scrollPositionY, isAtTop, isAtBottom){

				
				$('.jspPane').mousewheel(function(event, delta, deltaX, deltaY) {
					if(deltaY < 0){
					}
				});
		})*/

		/*$('.xboxOverlay').mousewheel(function(event, delta, deltaX, deltaY) {
			return false;
		});*/
		/*$(".xinsidebox").mousewheel(function(event, delta) {
			event.preventDefault();
		});*/
	};
})(jQuery); 


