var timeOut_modalCart;
var viewout = true;
var check_show_modal = true;
var template = "";
console.log(template)
let get_cart = link_checkout =>{
	$.ajax({
		type: 'GET',
		url: '/cart.js',
		async: false,
		cache: false,
		dataType: 'json',
		success: function (cart){
			debugger;
			let index = cart.items.findIndex(variant => variant.product_id == campaign_dc.product);
			if(campaign_dc.employ == true){
				debugger;
				if(index > -1 && cart.total_price >= campaign_dc.price_setup){
					template != 'cart' ? updateCartModal() : '';
				}
				else if(index > -1 && cart.total_price < campaign_dc.price_setup){
					remove_camp(index+1,link_checkout)
				}
				else if(index == -1 && cart.total_price >= campaign_dc.price_setup){
					//add_item_campaign(campaign_dc.product,link_checkout)
					getProductGift(campaign_dc.productHandle,link_checkout);
				}else{
					template != 'cart' ? updateCartModal() : '';
				}
			}
			else{
				template != 'cart' ? updateCartModal() : '';
				index > -1 ? remove_camp(index+1,link_checkout) : '';
			}

		}
	}).done(() =>{
		setTimeout(() =>{
			getCartModal();
		},300);
	});
}
let remove_camp = (line,link_checkout) =>{
	var params = {
		type: 'POST',
		url: '/cart/change.js',
		data: 'quantity=0&line=' + line,
		dataType: 'json',
		success: function(cart) {
			if(template != 'cart'){
				updateCartModal()
			}
		},
		error: (XMLHttpRequest, textStatus) => {

		}
	};
	jQuery.ajax(params);
}

function updateCartModal(){
	var cart = null;
	$('#cartform').hide();
	$.getJSON('/cart.js', function(cart, textStatus) {
		if(cart) {
			$('#cartform').show();
			$('.line-item:not(.original)').remove();
			$.each(cart.items,function(i,item){
				var total_line = 0;
				var total_line = item.quantity * item.price;
				tr = $('.original').clone().removeClass('original').appendTo('table#cart-table tbody');
				if(item.image != null)
					tr.find('.item-image').html("<img src=" + Haravan.resizeImage(item.image,'small') + ">");
				else
					tr.find('.item-image').html("<img src='//theme.hstatic.net/1000321269/1000887645/14/no_image.jpg?v=148'>");
				vt = item.variant_options;
				if(vt.indexOf('Default Title') != -1)
					vt = '';
				tr.find('.item-title').children('a').html(item.product_title + '<br><span>' + vt + '</span>').attr('href', item.url);
				tr.find('.item-quantity').html("<input id='quantity1' name='updates[]' min='1' type='number' value=" + item.quantity + " class='' />");
				if ( typeof(formatMoney) != 'undefined' ){
					tr.find('.item-price').html(Haravan.formatMoney(total_line, formatMoney));
				}else {
					tr.find('.item-price').html(Haravan.formatMoney(total_line, ''));
				}
				tr.find('.item-delete').html("<a href='javascript:void(0);' onclick='deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
			});
			$('.item-total').html(Haravan.formatMoney(cart.total_price, formatMoney));
			$('.modal-title').children('b').html(cart.item_count);
			$('.count-holder .count').html(cart.item_count );
			if(cart.item_count == 0){				
				$('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
				$('#cart-view').html('<tr><td>Hiện chưa có sản phẩm</td></tr>');
				$('#cartform').hide();
			}
			else{			
				$('#exampleModalLabel').html('Bạn có ' + cart.item_count + ' sản phẩm trong giỏ hàng.');
				$('#cartform').removeClass('hidden');
				$('#cart-view').html('');
			}
			if ( $('#cart-pos-product').length > 0 ) {
				$('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
			}
			$.each(cart.items,function(i,item){
				clone_item(item,i);
			});
			$('#total-view-cart').html(Haravan.formatMoney(cart.total_price, formatMoney));
		}
		else{
			$('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
			if ( $('#cart-pos-product').length > 0 ) {
				$('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
			}
			$('#cart-view').html('<tr><td>Hiện chưa có sản phẩm</td></tr>');
			$('#cartform').hide();
		}
	});
}
function getProductGift(handle,link_checkout){
		$.ajax({
			type: 'GET',
			url: '/products/'+handle+'?view=gift',
			async : false,
			success: function(data) {
				//do html vao day
				$('#modalProductGift .modal-content').html(data);
				$('#modalProductGift').modal('show');
				getCartModal();
				$('.btn-buygift').click(function(){
					var vid = $(this).parents('.right').find('.product-select select').val();
					add_item_campaign(vid,link_checkout);
				});
				$('.product-gift-close').click(function(){
					$('#modalProductGift').modal('hide');
				})
			}
		})
}
let add_item_campaign = (id,link_checkout) =>{
	$.ajax({
		type: 'POST',
		url: '/cart/add.js',
		async: false,
		data: 'quantity=1&id=' + id,
		dataType: 'json',
		success: function(line_item) {
			if(template == 'cart'){
				location.reload();
			}
			else{
				$('#modalProductGift').modal('hide');
				updateCartModal();
			}
		},
		error: function(XMLHttpRequest, textStatus) {
			alert('Sản phẩm bạn vừa mua đã vượt quá tồn kho');
		}
	})
}
var add_item_show_modalCart = function(id,quantity) {
	if( check_show_modal ) {
		check_show_modal = false;
		timeOut_modalCart = setTimeout(function(){ 
			check_show_modal = true;
		}, 3000);
		var params = {
			type: 'POST',
			url: '/cart/add.js',
			async: true,
			data: 'quantity=' + quantity + '&id=' + id,
			dataType: 'json',
			success: function(line_item) {
				/*if($(window).width() >= 768){
				getCartModal();					
				$('#myCart').modal('show');				
				$('.modal-backdrop').css({'height':$(document).height(),'z-index':'99'});
				/*}else{
					window.location = '/cart';
				}
				$('.addtocart-modal').removeClass('clicked_buy');
				$('.add-to-cartProduct-quickview').removeClass('clicked_buy');*/
				get_cart();
			},
			error: function(XMLHttpRequest, textStatus) {
				alert('Sản phẩm bạn vừa mua đã vượt quá tồn kho');
			}
		};
		$.ajax(params);
	}
}
var plusQuantity_quickview = function() {
	if ( $('input[name="quantity_quickview"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantity_quickview"]').val());
		if (!isNaN(currentVal)) {
			$('input[name="quantity_quickview"]').val(currentVal + 1);
		} else {
			$('input[name="quantity_quickview"]').val(1);
		}
	}
}
var minusQuantity_quickview = function() {
	if ( $('input[name="quantity_quickview"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantity_quickview"]').val());
		if (!isNaN(currentVal) && currentVal > 1) {
			$('input[name="quantity_quickview"]').val(currentVal - 1);
		}
	}
}
var plusQuantity = function() {
	if ( $('input[name="quantity"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantity"]').val());
		if (!isNaN(currentVal)) {
			$('input[name="quantity"]').val(currentVal + 1);
		} else {
			$('input[name="quantity"]').val(1);
		}
	}
	if ( $('input[name="quantiti_mb"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantiti_mb"]').val());
		if (!isNaN(currentVal)) {
			$('input[name="quantiti_mb"]').val(currentVal + 1);
		} else {
			$('input[name="quantiti_mb"]').val(1);
		}
	}
}
var minusQuantity = function() {
	if ( $('input[name="quantity"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantity"]').val());
		if (!isNaN(currentVal) && currentVal > 1) {
			$('input[name="quantity"]').val(currentVal - 1);
		}
	}
	if ( $('input[name="quantiti_mb"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantiti_mb"]').val());
		if (!isNaN(currentVal) && currentVal > 1) {
			$('input[name="quantiti_mb"]').val(currentVal - 1);
		}
	}
}
function getCartModal(){
	var cart = null;
	$('#cartform').hide();
	$('#myCart #exampleModalLabel').text("Giỏ hàng");
	$.getJSON('/cart.js', function(cart, textStatus) {
		if(cart) {
			$('#cartform').show();
			$('.line-item:not(.original)').remove();
			$.each(cart.items,function(i,item){
				var total_line = 0;
				var total_line = item.quantity * item.price;
				tr = $('.original').clone().removeClass('original').appendTo('table#cart-table tbody');
				if(item.image != null)
					tr.find('.item-image').html("<img src=" + Haravan.resizeImage(item.image,'small') + ">");
				else
					tr.find('.item-image').html("<img src='//theme.hstatic.net/1000321269/1000887645/14/no_image.jpg?v=148'>");
				vt = item.variant_options;
				if(vt.indexOf('Default Title') != -1)
					vt = '';
				tr.find('.item-title').children('a').html(item.product_title + '<br><span>' + vt + '</span>').attr('href', item.url);
				tr.find('.item-quantity').html("<input id='quantity1' name='updates[]' min='1' type='number' value=" + item.quantity + " class='' />");
				if ( typeof(formatMoney) != 'undefined' ){
					tr.find('.item-price').html(Haravan.formatMoney(total_line, formatMoney));
				}else {
					tr.find('.item-price').html(Haravan.formatMoney(total_line, ''));
				}
				tr.find('.item-delete').html("<a href='javascript:void(0);' onclick='deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
			});
			$('.item-total').html(Haravan.formatMoney(cart.total_price, formatMoney));
			$('.modal-title').children('b').html(cart.item_count);
			$('.count-holder .count').html(cart.item_count );
			if(cart.item_count == 0){				
				$('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
				$('#cart-view').html('<tr><td>Hiện chưa có sản phẩm</td></tr>');
				$('#cartform').hide();
			}
			else{			
				$('#exampleModalLabel').html('Bạn có ' + cart.item_count + ' sản phẩm trong giỏ hàng.');
				$('#cartform').removeClass('hidden');
				$('#cart-view').html('');
			}
			if ( $('#cart-pos-product').length > 0 ) {
				$('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
			}
			$.each(cart.items,function(i,item){
				clone_item(item,i);
			});
			$('#total-view-cart').html(Haravan.formatMoney(cart.total_price, formatMoney));
		} else{
			$('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
			if ( $('#cart-pos-product').length > 0 ) {
				$('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
			}
			$('#cart-view').html('<tr><td>Hiện chưa có sản phẩm</td></tr>');
			$('#cartform').hide();
		}
	});
	$('#site-overlay').addClass("active");
	$('.main-body').addClass("sidebar-move");
	$('#site-nav--mobile').addClass("active");
	$('#site-nav--mobile').removeClass("show-navigation").addClass("show-cart");
}
function clone_item(product,i){
	var item_product = $('#clone-item-cart').find('.item_2');
	if ( product.image == null ) {
		item_product.find('img').attr('src','//theme.hstatic.net/1000321269/1000887645/14/no_image.jpg?v=148').attr('alt', product.url);
	} else {
		item_product.find('img').attr('src',Haravan.resizeImage(product.image,'small')).attr('alt', product.url);
	}
	item_product.find('a:not(.remove-cart)').attr('href', product.url).attr('title', product.url);
	item_product.find('.pro-title-view').html(product.title);
	item_product.find('.pro-quantity-view').html(product.quantity);
	item_product.find('.pro-price-view').html(Haravan.formatMoney(product.price,formatMoney));
	item_product.find('.remove-cart').html("<a href='javascript:void(0);' onclick='deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
	var title = '';
	if(product.variant_options.indexOf('Default Title') == -1){
		$.each(product.variant_options,function(i,v){
			title = title + v + ' / ';
		});
		title = title + '@@';
		title = title.replace(' / @@','')
		item_product.find('.variant').html(title);
	}else {
		item_product.find('.variant').html('');
	}
	item_product.clone().removeClass('hidden').prependTo('#cart-view');
}
function deleteCart(line){
	var params = {
		type: 'POST',
		url: '/cart/change.js',
		data: 'quantity=0&line=' + line,
		dataType: 'json',
		success: function(cart) {
			get_cart();
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	$.ajax(params);
}
$(document).on("click","#update-cart-modal",function(event){
	event.preventDefault();
	if ($('#cartform').serialize().length <= 5) return;
	$(this).html('Đang cập nhật');
	var params = {
		type: 'POST',
		url: '/cart/update.js',
		data: $('#cartform').serialize(),
		dataType: 'json',
		success: function(cart) {
			if ((typeof callback) === 'function') {
				callback(cart);
			} else {
				getCartModal();
			}
			$('#update-cart-modal').html('Cập nhật');
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	$.ajax(params);
});
function fixHeightProduct(data_parent, data_target, data_image) {
	var box_height = 0;
	var box_image = 0;
	var boxtarget = data_parent + ' ' + data_target;
	var boximg = data_parent + ' ' + data_target + ' ' + data_image;
	$(boximg).css('height', 'auto');
	$($(boxtarget)).css('height', 'auto');
	$($(boxtarget)).removeClass('fixheight');
	$($(boxtarget)).each(function() {
		if ($(this).find(data_image+' .lazyloaded').height() > box_image) {
			box_image = $(this).find($(data_image)).height();
		}
	});
	if (box_image > 0) {
		$(boximg).height(box_image);
	}
	$($(boxtarget)).each(function() {
		if ($(this).height() > box_height) {
			box_height = $(this).height();
		}
	});
	$($(boxtarget)).addClass('fixheight');
	if (box_height > 0) {
		$($(boxtarget)).height(box_height);
	}
	try {
		fixheightcallback();
	} catch (ex) {}
}
document.addEventListener('lazyloaded', function(e){
	$('.wrapper-collection-1 .content-product-list .image-resize').imagesLoaded(function() {
		fixHeightProduct('.wrapper-collection-1 .content-product-list', '.product-resize', '.image-resize');
		$(window).resize(function() {
			fixHeightProduct('.wrapper-collection-1 .content-product-list', '.product-resize', '.image-resize');
		});
	});
	/*$('.wrapper-collection-2 .content-product-list .image-resize').imagesLoaded(function() {
		fixHeightProduct('.wrapper-collection-2 .content-product-list', '.product-resize', '.image-resize');
		$(window).resize(function() {
			fixHeightProduct('.wrapper-collection-2 .content-product-list', '.product-resize', '.image-resize');
		});
	});*/
	$('#collection-body .content-product-list .image-resize').imagesLoaded(function() {
		fixHeightProduct('#collection-body .content-product-list', '.product-resize', '.image-resize');
		$(window).resize(function() {
			fixHeightProduct('#collection-body .content-product-list', '.product-resize', '.image-resize');
		});
	});
	$('.list-productRelated .content-product-list .image-resize').imagesLoaded(function() {
		fixHeightProduct('.list-productRelated .content-product-list', '.product-resize', '.image-resize');
		$(window).resize(function() {
			fixHeightProduct('.list-productRelated .content-product-list', '.product-resize', '.image-resize');
		});
	});
	$('.list-slider-banner .image-resize').imagesLoaded(function() {
		fixHeightProduct('.list-slider-banner', '.product-resize', '.image-resize');
		$(window).resize(function() {
			fixHeightProduct('.list-slider-banner', '.product-resize', '.image-resize');
		});
	});
	$('.search-list-results .image-resize').imagesLoaded(function() {
		fixHeightProduct('.search-list-results', '.product-resize', '.image-resize');
		$(window).resize(function() {
			fixHeightProduct('.search-list-results', '.product-resize', '.image-resize');
		});
	});
});
$(document).ready(function(){
	var htmlprev = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 511.995 511.995" style="enable-background:new 0 0 511.995 511.995;" xml:space="preserve"><g><g><path d="M381.039,248.62L146.373,3.287c-4.083-4.229-10.833-4.417-15.083-0.333c-4.25,4.073-4.396,10.823-0.333,15.083L358.56,255.995L130.956,493.954c-4.063,4.26-3.917,11.01,0.333,15.083c2.063,1.979,4.729,2.958,7.375,2.958c2.813,0,5.604-1.104,7.708-3.292L381.039,263.37C384.977,259.245,384.977,252.745,381.039,248.62z"/></g></g></svg>';
	var htmlnext = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 511.995 511.995" style="enable-background:new 0 0 511.995 511.995;" xml:space="preserve"><g><g><path d="M381.039,248.62L146.373,3.287c-4.083-4.229-10.833-4.417-15.083-0.333c-4.25,4.073-4.396,10.823-0.333,15.083L358.56,255.995L130.956,493.954c-4.063,4.26-3.917,11.01,0.333,15.083c2.063,1.979,4.729,2.958,7.375,2.958c2.813,0,5.604-1.104,7.708-3.292L381.039,263.37C384.977,259.245,384.977,252.745,381.039,248.62z"/></g></g></svg>';
	if(template.indexOf('index') > -1){
		$('#home-slider .owl-carousel').owlCarousel({
			items:1,
			nav: true,
			navText:[htmlprev,htmlnext],
			dots: true,
			lazyLoad:true,
			touchDrag: true,
			loop: true,
		});

		if($("#collection-slide").length > 0) {
			$('#collection-slide').owlCarousel({
				items:4,
				nav:false,
				dots:false,
				pagination: false,
				slideSpeed : 1000,
				smartSpeed:1000,
				addClassActive: true,
				scrollPerPage: false,
				touchDrag: true,
				autoplay: true,
				loop: true,
				responsive:{
					0:{
						items:2,
						margin: 10,
						nav: false,
						dots:true,
						autoplay: false,
						navText:[htmlprev,htmlnext]
					},
					480:{
						items:2,
						margin: 15,
						nav: false,
						dots:true,
						autoplay: false,
						navText:[htmlprev,htmlnext]
					},
					768:{
						items:3,
						margin: 15,
						nav: true,
						navText:[htmlprev,htmlnext]
					},
					992:{
						items:4,
						margin: 20
					},
					1200:{
						items:4,
						margin: 20
					}
				}

			});
		}
		if($("#collection-slide2").length > 0) {
			$('#collection-slide2').owlCarousel({
				items:4,
				nav:false,
				dots:false,
				pagination: false,
				slideSpeed : 1000,
				smartSpeed:1000,
				addClassActive: true,
				scrollPerPage: false,
				touchDrag: true,
				autoplay: true,
				loop: true,
				responsive:{
					0:{
						items:2,
						margin: 10,
						nav: false,
						dots:true,
						autoplay: false,
						navText:[htmlprev,htmlnext]
					},
					480:{
						items:2,
						margin: 15,
						nav: false,
						dots:true,
						autoplay: false,
						navText:[htmlprev,htmlnext]
					},
					768:{
						items:3,
						margin: 15,
						nav: true,
						navText:[htmlprev,htmlnext]
					},
					992:{
						items:4,
						margin: 20
					},
					1200:{
						items:4,
						margin: 20
					}
				}

			});
		}
		if ($(window).width() < 768) {
			if($("#blog-slide").length > 0) {
				$('#blog-slide').owlCarousel({
					items:3,
					nav: true,
					dots: false,
					pagination: false,
					slideSpeed : 1000,
					smartSpeed: 1000,
					addClassActive: true,
					scrollPerPage: false,
					touchDrag: true,
					autoplay: false,
					loop: false,
					responsive:{
						0:{
							items:1,
							margin: 15,
							stagePadding: 40,
							nav: false
						},
					}
				});
			}
		}
		
	}
	if(template.indexOf('product') > -1){
		if($("#owlProductRelated").length > 0){
			$('#owlProductRelated').owlCarousel({
				items:5,
				nav: true,
				dots: false,
				pagination: false,
				slideSpeed : 1000,
				smartSpeed:1000,
				addClassActive: true,
				scrollPerPage: false,
				touchDrag: true,
				autoplay: false,
				loop: false,
				responsive:{
					0:{
						items:2,
						margin: 3,
						stagePadding: 20
					},
					768:{
						items:4,
						margin: 3
					},
					992:{
						items:5,
						margin: 20
					},
					1200:{
						items:5,
						margin: 20
					}
				}
			});
		}
	}
	$(document).on("click", ".btnProductQuickview", function(){
		var handle = $(this).attr("data-handle");
		$.ajax({ 
			url: '/products/' + handle + "?view=quickview",	
			async: true,
			success:function(data){
				$("#quickview-desktop .modal-body").html(data);
				$("#quickview-desktop").modal('show'); 
			}
		});
	});
	if ($(window).width() < 768) {
		$(document).on("click",'.main-footer .footer-col .footer-title', function(){
			$(this).toggleClass('active').parent().find('.footer-content').stop().slideToggle('medium');
		});
		/*
		$('a.btn-fter').click(function(e){
			if ( $(this).attr('aria-expanded') == 'false' ) {
				e.preventDefault();
				$(this).attr('aria-expanded','true');
				$('.main-footer').addClass('bg-active');
			} else {
				$(this).attr('aria-expanded','false');
				$('.main-footer').removeClass('bg-active');
			}
		});*/
	}
	if ($('.addThis_listSharing').length > 0){
		$(window).scroll(function(){
			if($(window).scrollTop() > 100 ) {
				$('.addThis_listSharing').addClass('is-show');
			} else {
				$('.addThis_listSharing').removeClass('is-show');
			}
		});
		$('.content_popupform form.contact-form').submit(function(e){
			e.preventDefault();
			$.ajax({
				type: 'POST',
				url:'/contact',
				data: $('.content_popupform form.contact-form').serialize(),			 
				success:function(data){		
					$('.modal-contactform.fade.in').modal('hide');
					setTimeout(function(){ 				
						$('.modal-succes').modal('show');					
						setTimeout(function(){							
							location.reload();
						}, 5000);
					},300);
				},				
			})
		});
	}
	if ($(window).width() < 768 && $('.layoutProduct_scroll').length > 0 ) {
		var curScrollTop = 0;
		$(window).scroll(function(){	
			var scrollTop = $(window).scrollTop();
			if(scrollTop > curScrollTop  && scrollTop > 200 ) {
				$('.layoutProduct_scroll').removeClass('scroll-down').addClass('scroll-up');
			}
			else {
				if (scrollTop > 200 && scrollTop + $(window).height() + 150 < $(document).height()) {
					$('.layoutProduct_scroll').removeClass('scroll-up').addClass('scroll-down');	
				}
			}
			if(scrollTop < curScrollTop  && scrollTop < 200 ) {
				$('.layoutProduct_scroll').removeClass('scroll-up').removeClass('scroll-down');
			}
			curScrollTop = scrollTop;
		});
	}
	$(".proDetailInfo a").click(function(){
		var tab = $(this).attr("data-tab");
		$(".proDetailInfo li").removeClass("active");
		$(this).parent().addClass("active");
		$(".tab-content .tab-pane").removeClass("active");
		$(".tab-content .tab-pane[id="+tab+"]").addClass("active");
	});
	$(".filterTagFullwidthButton-desktop, .filterTagFullwidthButton-mobile").click(function(){
		$("body").addClass("open-filter");
	});
	$(document).on("click", "body.open-filter #site-overlay, .filterTagFullwidthClose", function(){
		$("body").removeClass("open-filter");
	});
	$(document).on("mouseenter",".variantColor li:not(.not-hover)", function(){
		var img = $(this).attr("data-src");
		$(this).parents(".product-block").find(".product-img picture:first-child source").attr("srcset",img);
		$(this).parents(".product-block").find(".product-img picture:first-child img").attr("src",img);
	});
	$("#site-menu-handle").on("click", function(){
		$('.main-body').addClass("sidebar-move");
		$('#site-overlay').addClass('active');
		$('#site-nav--mobile').toggleClass("show-navigation");
	});
	$("#site-cart-handle").on("click", function(){
		$('.main-body').addClass("sidebar-move");
		$('#site-overlay').addClass('active');
		$('#site-nav--mobile').toggleClass("show-cart");
	});
	
	$("#site-close-handle, #site-overlay").click(function(){
		$(".main-body").removeClass("sidebar-move");
		$('#site-nav--mobile').removeClass("show-navigation").removeClass("show-cart");
		$('#site-overlay').removeClass('active');
	});
});
$(document).on("click", "span.icon-subnav", function(){
	if ($(this).parent().hasClass('active')) {
		$(this).parent().removeClass('active');
		$(this).siblings('ul').slideUp();
	} else {
		if( $(this).parent().hasClass("level0") || $(this).parent().hasClass("level1")){
			$(this).parent().siblings().find("ul").slideUp();
			$(this).parent().siblings().removeClass("active");
		}
		$(this).parent().addClass('active');
		$(this).siblings('ul').slideDown();
	}
});
/*
$(document).on("click", ".back-to-top", function(){
	$(this).removeClass('show');
	$('html, body').animate({
		scrollTop: 0			
	}, 800);
});*/
$(window).scroll(function() {
	/*
	if ( $('.back-to-top').length > 0 && $(window).scrollTop() > 500 ) {
		$('.back-to-top').addClass('show');
	} else {
		$('.back-to-top').removeClass('show');
	}*/
	if ($(window).width() < 992) {
		var scroll = $(window).scrollTop();
		if (scroll < 320) {
			$(".main-header").removeClass("scroll-menu");	
		} else {
			$(".main-header").addClass("scroll-menu");		
		}
	} else {
		var height_header =	$('.main-header').height();
		if( $(window).scrollTop() >= height_header ) {			
			$('.main-header').addClass('affix-mobile');
		}	else {
			$('.main-header').removeClass('affix-mobile');
		}
	}
});
$('a[data-spy=scroll]').click(function(){
	event.preventDefault() ;
	$('body').animate({scrollTop: ($($(this).attr('href')).offset().top - 20) + 'px'}, 500);
})
var buy_now = function(id) {
	var quantity = 1;
	var params = {
		type: 'POST',
		url: '/cart/add.js',
		data: 'quantity=' + quantity + '&id=' + id,
		dataType: 'json',
		success: function(line_item) {
			window.location = '/checkout';
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	$.ajax(params);
}
$('.plus-nClick1').click(function(e){
	e.preventDefault();
	$(this).parents('.level0').toggleClass('opened');
	$(this).parents('.level0').children('ul').slideToggle(200);
});
$('.plus-nClick2').click(function(e){
	e.preventDefault();
	$(this).parents('.level1').toggleClass('opened');
	$(this).parents('.level1').children('ul').slideToggle(200);
});

$('.title_block').click(function(){
	if($(this).hasClass('active')){
		$(this).removeClass('active');
		$(this).next().slideToggle('medium');
	}else{
		$(this).addClass('active');
		$(this).next().slideToggle('medium');
	}
});    
$(document).on("click",".dropdown-filter", function(){
	if ( $(this).parent().attr('aria-expanded') == 'false' ) {
		$(this).parent().attr('aria-expanded','true');
	} else {
		$(this).parent().attr('aria-expanded','false');
	}
});

/* search header*/
$('.ultimate-search').submit(function(e) {
	e.preventDefault();
	var q = $(this).find('input[name=q]').val();
	if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
		alert('Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại key word khác');
		$(this).find('input[name=q]').val('');
	}else{
		var q_follow = 'product';
		var query = encodeURIComponent('(title:product contains ' + q + ')');
		if( !q ) {
			window.location = '/search?type='+ q_follow +'&q=*';
			return;
		}	
		else {
			window.location = '/search?type=' + q_follow +'&q=filter=' + query;
			return;
		}
	}
});
var $input = $('.ultimate-search input[type="text"]');
$input.bind('keyup change paste propertychange', function() {
	var key = $(this).val(),
			$parent = $(this).parents('.wpo-wrapper-search'),
			$results = $(this).parents('.wpo-wrapper-search').find('.smart-search-wrapper');
	if(key.indexOf('script') > -1 || key.indexOf('>') > -1){
		alert('Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại key word khác');
		$(this).val('');
	}else{
		if(key.length > 0 ){
			$(this).attr('data-history', key);
			var q_follow = 'product',
					str = '';
			str = '/search?q=filter=(title:product contains ' + key + ')&view=ultimate-product';
			$.ajax({
				url: str,
				type: 'GET',
				async: true,
				success: function(data){
					$results.find('.resultsContent').html(data);
				}
			})
			$results.fadeIn();
		}
		else{
			$results.fadeOut();
		}
	}
});
$('input[name="follow"]').on('change', function(){
	$('.ultimate-search input[type="text"]').trigger('change');
})
$('input[name="follow_mobile"]').on('change', function(){
	$('.ultimate-search input[type="text"]').trigger('change');
})
$('body').click(function(evt) {
	var target = evt.target;
	/*if (target.id !== 'ajaxSearchResults' && target.id !== 'inputSearchAuto') {
		$(".ajaxSearchResults").hide();
	}*/
	if (target.id !== 'ajaxSearchResults-mb' && target.id !== 'inputSearchAuto-mb') {
		$(".ajaxSearchResults").hide();
	}
	if (target.id !== 'ajaxSearchResults-mb' && target.id !== 'inputSearchAuto-desktop') {
		$(".ajaxSearchResults").hide();
	}
});
$('body').on('click', '.ultimate-search input[type="text"]', function() {
	if ($(this).is(":focus")) {
		if ($(this).val() != '') {
			$(".ajaxSearchResults").show();
		}
	} else {}
})