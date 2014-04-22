/*
 * SimpleModal 1.4.1 - jQuery Plugin
 * http://www.ericmmartin.com/projects/simplemodal/
 * Copyright (c) 2010 Eric Martin (http://twitter.com/ericmmartin)
 * Dual licensed under the MIT and GPL licenses
 * Revision: $Id: jquery.simplemodal.js 261 2010-11-05 21:16:20Z emartin24 $
 */
(function(d){var k=d.browser.msie&&parseInt(d.browser.version)===6&&typeof window.XMLHttpRequest!=="object",m=d.browser.msie&&parseInt(d.browser.version)===7,l=null,f=[];d.modal=function(a,b){return d.modal.impl.init(a,b)};d.modal.close=function(){d.modal.impl.close()};d.modal.focus=function(a){d.modal.impl.focus(a)};d.modal.setContainerDimensions=function(){d.modal.impl.setContainerDimensions()};d.modal.setPosition=function(){d.modal.impl.setPosition()};d.modal.update=function(a,b){d.modal.impl.update(a,
b)};d.fn.modal=function(a){return d.modal.impl.init(this,a)};d.modal.defaults={appendTo:"body",focus:true,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:false,autoPosition:true,zIndex:1E3,close:true,closeHTML:'<a class="modalCloseImg" title="Close"></a>',closeClass:"simplemodal-close",escClose:true,overlayClose:false,position:null,
persist:false,modal:true,onOpen:null,onShow:null,onClose:null};d.modal.impl={d:{},init:function(a,b){var c=this;if(c.d.data)return false;l=d.browser.msie&&!d.boxModel;c.o=d.extend({},d.modal.defaults,b);c.zIndex=c.o.zIndex;c.occb=false;if(typeof a==="object"){a=a instanceof jQuery?a:d(a);c.d.placeholder=false;if(a.parent().parent().size()>0){a.before(d("<span></span>").attr("id","simplemodal-placeholder").css({display:"none"}));c.d.placeholder=true;c.display=a.css("display");if(!c.o.persist)c.d.orig=
a.clone(true)}}else if(typeof a==="string"||typeof a==="number")a=d("<div></div>").html(a);else{alert("SimpleModal Error: Unsupported data type: "+typeof a);return c}c.create(a);c.open();d.isFunction(c.o.onShow)&&c.o.onShow.apply(c,[c.d]);return c},create:function(a){var b=this;f=b.getDimensions();if(b.o.modal&&k)b.d.iframe=d('<iframe src="javascript:false;"></iframe>').css(d.extend(b.o.iframeCss,{display:"none",opacity:0,position:"fixed",height:f[0],width:f[1],zIndex:b.o.zIndex,top:0,left:0})).appendTo(b.o.appendTo);
b.d.overlay=d("<div></div>").attr("id",b.o.overlayId).addClass("simplemodal-overlay").css(d.extend(b.o.overlayCss,{display:"none",opacity:b.o.opacity/100,height:b.o.modal?f[0]:0,width:b.o.modal?f[1]:0,position:"fixed",left:0,top:0,zIndex:b.o.zIndex+1})).appendTo(b.o.appendTo);b.d.container=d("<div></div>").attr("id",b.o.containerId).addClass("simplemodal-container").css(d.extend(b.o.containerCss,{display:"none",position:"fixed",zIndex:b.o.zIndex+2})).append(b.o.close&&b.o.closeHTML?d(b.o.closeHTML).addClass(b.o.closeClass):
"").appendTo(b.o.appendTo);b.d.wrap=d("<div></div>").attr("tabIndex",-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(b.d.container);b.d.data=a.attr("id",a.attr("id")||b.o.dataId).addClass("simplemodal-data").css(d.extend(b.o.dataCss,{display:"none"})).appendTo("body");b.setContainerDimensions();b.d.data.appendTo(b.d.wrap);if(k||l)b.fixIE()},bindEvents:function(){var a=this;d("."+a.o.closeClass).bind("click.simplemodal",function(b){b.preventDefault();a.close()});
a.o.modal&&a.o.close&&a.o.overlayClose&&a.d.overlay.bind("click.simplemodal",function(b){b.preventDefault();a.close()});d(document).bind("keydown.simplemodal",function(b){if(a.o.modal&&b.keyCode===9)a.watchTab(b);else if(a.o.close&&a.o.escClose&&b.keyCode===27){b.preventDefault();a.close()}});d(window).bind("resize.simplemodal",function(){f=a.getDimensions();a.o.autoResize?a.setContainerDimensions():a.o.autoPosition&&a.setPosition();if(k||l)a.fixIE();else if(a.o.modal){a.d.iframe&&a.d.iframe.css({height:f[0],
width:f[1]});a.d.overlay.css({height:f[0],width:f[1]})}})},unbindEvents:function(){d("."+this.o.closeClass).unbind("click.simplemodal");d(document).unbind("keydown.simplemodal");d(window).unbind("resize.simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var a=this,b=a.o.position;d.each([a.d.iframe||null,!a.o.modal?null:a.d.overlay,a.d.container],function(c,h){if(h){var g=h[0].style;g.position="absolute";if(c<2){g.removeExpression("height");g.removeExpression("width");g.setExpression("height",
'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"');g.setExpression("width",'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"')}else{var e;if(b&&b.constructor===Array){c=b[0]?typeof b[0]==="number"?b[0].toString():b[0].replace(/px/,""):h.css("top").replace(/px/,"");c=c.indexOf("%")===-1?c+' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"':
parseInt(c.replace(/%/,""))+' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"';if(b[1]){e=typeof b[1]==="number"?b[1].toString():b[1].replace(/px/,"");e=e.indexOf("%")===-1?e+' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"':parseInt(e.replace(/%/,""))+' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'}}else{c=
'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"';e='(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'}g.removeExpression("top");g.removeExpression("left");g.setExpression("top",
c);g.setExpression("left",e)}}})},focus:function(a){var b=this;a=a&&d.inArray(a,["first","last"])!==-1?a:"first";var c=d(":input:enabled:visible:"+a,b.d.wrap);setTimeout(function(){c.length>0?c.focus():b.d.wrap.focus()},10)},getDimensions:function(){var a=d(window);return[d.browser.opera&&d.browser.version>"9.5"&&d.fn.jquery<"1.3"||d.browser.opera&&d.browser.version<"9.5"&&d.fn.jquery>"1.2.6"?a[0].innerHeight:a.height(),a.width()]},getVal:function(a,b){return a?typeof a==="number"?a:a==="auto"?0:
a.indexOf("%")>0?parseInt(a.replace(/%/,""))/100*(b==="h"?f[0]:f[1]):parseInt(a.replace(/px/,"")):null},update:function(a,b){var c=this;if(!c.d.data)return false;c.d.origHeight=c.getVal(a,"h");c.d.origWidth=c.getVal(b,"w");c.d.data.hide();a&&c.d.container.css("height",a);b&&c.d.container.css("width",b);c.setContainerDimensions();c.d.data.show();c.o.focus&&c.focus();c.unbindEvents();c.bindEvents()},setContainerDimensions:function(){var a=this,b=k||m,c=a.d.origHeight?a.d.origHeight:d.browser.opera?
a.d.container.height():a.getVal(b?a.d.container[0].currentStyle.height:a.d.container.css("height"),"h");b=a.d.origWidth?a.d.origWidth:d.browser.opera?a.d.container.width():a.getVal(b?a.d.container[0].currentStyle.width:a.d.container.css("width"),"w");var h=a.d.data.outerHeight(true),g=a.d.data.outerWidth(true);a.d.origHeight=a.d.origHeight||c;a.d.origWidth=a.d.origWidth||b;var e=a.o.maxHeight?a.getVal(a.o.maxHeight,"h"):null,i=a.o.maxWidth?a.getVal(a.o.maxWidth,"w"):null;e=e&&e<f[0]?e:f[0];i=i&&i<
f[1]?i:f[1];var j=a.o.minHeight?a.getVal(a.o.minHeight,"h"):"auto";c=c?a.o.autoResize&&c>e?e:c<j?j:c:h?h>e?e:a.o.minHeight&&j!=="auto"&&h<j?j:h:j;e=a.o.minWidth?a.getVal(a.o.minWidth,"w"):"auto";b=b?a.o.autoResize&&b>i?i:b<e?e:b:g?g>i?i:a.o.minWidth&&e!=="auto"&&g<e?e:g:e;a.d.container.css({height:c,width:b});a.d.wrap.css({overflow:h>c||g>b?"auto":"visible"});a.o.autoPosition&&a.setPosition()},setPosition:function(){var a=this,b,c;b=f[0]/2-a.d.container.outerHeight(true)/2;c=f[1]/2-a.d.container.outerWidth(true)/
2;if(a.o.position&&Object.prototype.toString.call(a.o.position)==="[object Array]"){b=a.o.position[0]||b;c=a.o.position[1]||c}else{b=b;c=c}a.d.container.css({left:c,top:b})},watchTab:function(a){var b=this;if(d(a.target).parents(".simplemodal-container").length>0){b.inputs=d(":input:enabled:visible:first, :input:enabled:visible:last",b.d.data[0]);if(!a.shiftKey&&a.target===b.inputs[b.inputs.length-1]||a.shiftKey&&a.target===b.inputs[0]||b.inputs.length===0){a.preventDefault();b.focus(a.shiftKey?"last":
"first")}}else{a.preventDefault();b.focus()}},open:function(){var a=this;a.d.iframe&&a.d.iframe.show();if(d.isFunction(a.o.onOpen))a.o.onOpen.apply(a,[a.d]);else{a.d.overlay.show();a.d.container.show();a.d.data.show()}a.o.focus&&a.focus();a.bindEvents()},close:function(){var a=this;if(!a.d.data)return false;a.unbindEvents();if(d.isFunction(a.o.onClose)&&!a.occb){a.occb=true;a.o.onClose.apply(a,[a.d])}else{if(a.d.placeholder){var b=d("#simplemodal-placeholder");if(a.o.persist)b.replaceWith(a.d.data.removeClass("simplemodal-data").css("display",
a.display));else{a.d.data.hide().remove();b.replaceWith(a.d.orig)}}else a.d.data.hide().remove();a.d.container.hide().remove();a.d.overlay.hide();a.d.iframe&&a.d.iframe.hide().remove();setTimeout(function(){a.d.overlay.remove();a.d={}},10)}}}})(jQuery);

/**
 * Confirm对话框
 * (String)message - 欲显示的内容
 * (Function)callback - 回调函数
 */
function wp_confirm(message, callback, cancelBack){
	if ($('#wp-confirmpnl_overlay,#wp-confirm_panel').size()) return;
	var width = 286,pnl = '',ol = '<div id="wp-confirmpnl_overlay"></div>';
	pnl = '<div id="wp-confirm_panel" class="overz wp-manage_panel wp-alert-panel" style="position:absolute;width:'+width+'px;z-index:10001;">'
	+'<div class="wp-panel_outpadding overz"><div class="wp-manage_panel_block_one wp-manage-link overz"><h2 class="overz">'+message+'</h2></div>'
	+'<div class="wp-alert_button overz"><a href="javascript:;" class="wp-alert-sure">'+translate('Sure')+'</a><a href="javascript:;" class="wp-alert-cancel">'+translate('Cancel')+'</a></div></div></div>';
	$(ol+pnl).appendTo('body');
	var $cpnl = $('#wp-confirm_panel');
	$cpnl.bind('rename',function(e,name){
		if (name.length) {var self = this;
			$('a.wp-alert-sure',self).html(name);
			var timerid = setTimeout(function(){
				var newidth = $('a.wp-alert-sure',self).outerWidth(true) + $('a.wp-alert-cancel',self).outerWidth(true);
				$('.wp-alert_button',self).width(newidth);newidth = null;clearTimeout(timerid);
			}, 50);
		}
	});
	// 动态设置wp-alert_button宽度
	var resetWtimer = setTimeout(function(){
		var $altbtn = $cpnl.find('.wp-alert_button');
		$altbtn.width($altbtn.outerWidth());
//		var maxw = 0,$altbtn = $cpnl.find('.wp-alert_button');
//		$altbtn.children('a').each(function(i,a){
//			maxw += $(this).outerWidth(true);
//		});
//		if(maxw) $altbtn.width(maxw);
	},30);
	// 定位Dialog
	panel_position($cpnl,width,'auto',true,'wp-confirmpnl_overlay');
	// Bind window resize
	$(window).resize(function(){
		panel_position($cpnl,width,'auto',true,'wp-confirmpnl_overlay');
	});
	// 绑定"OK|Cancel"按钮
	$cpnl.find('a.wp-alert-sure').click(function(e){
		if(callback && $.isFunction(callback)) callback();
		$cpnl.add('#wp-confirmpnl_overlay').remove();
		if(resetWtimer) clearTimeout(resetWtimer);
		e.preventDefault();
	}).end().find('a.wp-alert-cancel').click(function(e){
		if(cancelBack && $.isFunction(cancelBack)) cancelBack();
		$cpnl.add('#wp-confirmpnl_overlay').remove();
		if(resetWtimer) clearTimeout(resetWtimer);
		e.preventDefault();
	});
	// 绑定Enter事件
	$(document).keydown(function(e){
		if(e.keyCode == 13) $cpnl.find('a.wp-alert-sure').trigger('click');
	});
	return false;
}

function wp_editPicOnline(param)
{
	var imgtype=parseInt(getImageProcessType())||0; //图片处理  0 使用aviary处理  1 使用美图秀秀处理
	var imgprocess=['feather','xiuxiu'];
	if(imgtype >= imgprocess.length) imgtype=0;
	var imgtypestr=imgprocess[imgtype];
	
	$LAB.script(relativeToAbsoluteURL('script/wopop2_'+imgtypestr+'.js'))
	.wait(function(){
		wp_editPicOnlineActual(param);
	})
}

/**
 * Alert对话框
 * (String)message - 欲显示的内容
 */
function wp_alert(message,callback){
	if ($('#wp-alertpnl_overlay,#wp-alert_panel').size()) return;
	var width = 286,pnl = '',ol = '<div id="wp-alertpnl_overlay"></div>';	
	pnl = '<div id="wp-alert_panel" class="overz wp-manage_panel wp-alert-panel" style="position:absolute;width:'+width+'px;z-index:10001;">'
	+'<div class="wp-panel_outpadding overz"><div class="wp-manage_panel_block_one wp-manage-link overz"><h2 class="overz">'+message+'</h2></div>'
	+'<div class="wp-alert_button overz" style="width:55px;"><a href="javascript:;" class="wp-alert-sure">'+translate('Sure')+'</a></div></div></div>';
	$(ol+pnl).appendTo('body');
	var $apnl = $('#wp-alert_panel');
	// 定位Dialog
	panel_position($apnl,width,'auto',true,'wp-alertpnl_overlay');
	// Bind window resize
	$(window).resize(function(){
		panel_position($apnl,width,'auto',true,'wp-alertpnl_overlay');
	});
	// 绑定"OK"按钮
	$apnl.find('a.wp-alert-sure').click(function(e){
		$apnl.add('#wp-alertpnl_overlay').remove();
		if($.isFunction(callback)) callback();
		e.preventDefault();
	});
	// 绑定Enter事件
	$(document).keydown(function(e){
		if(e.keyCode == 13) $apnl.find('a.wp-alert-sure').trigger('click');
	});

	return false;
}

/**
 * --------------------------------------------------------
 * Popup对话框(临时函数)
 * --------------------------------------------------------
 */
function show_dialog(load_url, title, width, height, callback, opentype){
	var fn = $.extend({}, {
		open: function(d){},
		close: function(d){}
	}, callback || {});
	$('#osx-modal-content').modal({
		overlayId: 'osx-overlay',
		containerId: 'osx-container',
		closeHTML: null,
		zIndex: 1000,
		opacity: 25,
		onOpen: function(d){
			fn.open(d);
			var self = this, $container = d.container, container = $container[0];
			var $data = $('#osx-modal-data', container);
			if (opentype == 'iframe') {								
				$data.html('<iframe src="'+load_url+'" frameborder="0" width="'+width+'" onload="this.height=this.contentWindow.document.documentElement.scrollHeight" scrolling="no"></iframe>');
				d.overlay.show();
				$data.show();
				$('#osx-modal-content,div.close', container).show();
				$('#osx-modal-title', container).html(title).show();
				$container.fadeTo('fast',1).draggable({handle: '#osx-modal-title',cursor: 'move'});
			} else {
				var $ajaxload = $('#wp-ajaxsend_loading2'),$win = $(window);
				if($ajaxload.size()==0)  $('<div id="wp-ajaxsend_loading2" style="width:'+$win.width()+'px;height:'+$win.height()+'px;z-index:9999;"><img src="'+relativeToAbsoluteURL('template/default/images/loading.gif')+'" width="32" height="32" /></div>').appendTo('body');
				$.get(load_url, function(data){
					$data.html(data);
					d.overlay.show();
					$data.show();
					$('#osx-modal-content,div.close', container).show();
					$('#osx-modal-title', container).html(title).show();
					$container.fadeTo('fast',1).draggable({handle: '#osx-modal-title',cursor: 'move'});
					self.setPosition();
					$('#wp-ajaxsend_loading2').remove();
				}).error(function(){
					$('#wp-ajaxsend_loading2').remove();
					alert(translate('Request failed!')); 
					self.close();return;
				});
			}
			if(width > 0) $container.css('width', width);
			$container.css('height', height || '');
			$('#osx-modal-content').bind('add_loading',function(){
				var loading=$data.children('.loading');
				if(loading.size()) loading.remove();
				$('<div class="loading" style="width:'+$data.width()+'px;height:'+$data.outerHeight()+'px;z-index:9999;"><img src="'+relativeToAbsoluteURL('template/default/images/loading.gif')+'" width="32" height="32" /></div>').appendTo($data);
			})

//			d.overlay.fadeIn('slow', function(){
//				$data.show();
//				$('#osx-modal-content,div.close', container).show();
//				$('#osx-modal-title', container).html(title).show();
//
//				$container.fadeTo('fast',1).draggable({handle: '#osx-modal-title',cursor: 'move'});
//			});
		},
		onClose: function(d){
			fn.close(d);
			var self = this;
			d.container.hide();
			d.overlay.hide();
			$("#osx-modal-content").triggerHandler('dialogclose', d);
			$("#osx-modal-content").unbind('dialogclose');
			$('#osx-modal-content').unbind('add_loading');
			setTimeout(function(){
				self.close();
			},500)
			
//			d.container.fadeOut('slow', function(){
//				d.overlay.fadeOut('slow', function(){
//					$("#osx-modal-content").triggerHandler('dialogclose', d);
//					$("#osx-modal-content").unbind('dialogclose');
//					self.close();
//				});
//			});
		}
	});
}

/*获取样式*/
function get_plugin_css(tagid,css){
	var setcss=$("#page_set_css").html();
	setcss=setcss.replace(/<style>/ig,'').replace(/<\/style>/ig,'').replace(/[\r]/g, " ").replace(/[\n]/g, " ").replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
	var reg = eval("/\\/\\*"+tagid+"\\*\\/(.*)\\/\\*"+tagid+"\\*\\//ig");
	setcss=setcss.replace(reg,'');	
	if(setcss&&$.trim(setcss) != '') css=css.replace(/@charset [^;]+;/i,'');
	var tempcss=setcss + ' /*'+ tagid +'*/ '+css+' /*'+ tagid +'*/ ';
	tempcss=tempcss.replace(/&gt;/ig,'>');
	$("#page_set_css").html('<style> '+tempcss + '</style>');
}

(function( $, undefined ) {
	var callbackhash={};
	var mod_property={};
	
	$.modplugin={
		addCallBack:function(type,funcname,func){
			if($.isFunction(func)){
				if(!callbackhash[type]) callbackhash[type]={};
				callbackhash[type][funcname]=func;
			}
		},
		fireCallBack:function(type,funcname,dom,data){
			var func=callbackhash[type];
			if(!func) return false;
			func=func[funcname];
			if($.isFunction(func)){
				return func(dom,data);
			}else{
				return false;
			}
		}
	}
	
	$.fn.execPluginCallBack=function(funcname,data){
			return $.modplugin.fireCallBack(this.attr('type'),funcname,this,data);
	}
	
	$.fn.mod_property=function(key,val){
		     if($.isPlainObject(key)){
					for(var inkey in key){
						this.mod_property(inkey,key[inkey]);
					}
					return ;
			 }
			var id=this.prop('id');
			if(!id) return null;
			var propertydata=mod_property[id];
			if(!propertydata){
				mod_property[id]=propertydata={};
			}
			if(val !== undefined){
				propertydata[key]=val;
				return val;
			}else{
				return propertydata[key];
			}
	}
	
	
	var PropertyCommand=null;
	function initPropCommand(){
		if(PropertyCommand) return;
		PropertyCommand=Undo.Command.createModuleCommand(function(blockid,val){
			var blockel=$('#'+blockid);
			if(val.propval!=undefined) blockel.mod_property(val.propkey,val.propval);
			else blockel.del_mod_property(val.propkey);
			blockel.execPluginCallBack('property_undo',val); 
		},null,{returntype:'class'});
	}
	
	$.fn.autoundo_mod_property=function(key,val){
		if(val === undefined) return this.mod_property(key);
		initPropCommand();
		var oldval=this.mod_property(key);
		this.mod_property(key,val);
		var oldvalue={propkey:key,propval:oldval,act:'set',cmdtype:'undo'}
		var newvalue={propkey:key,propval:val,act:'set',cmdtype:'redo'}
		if(!Undo.Command.DefaultEqAct(oldval,val)) new PropertyCommand(this.attr('id')).insertWithVals(oldvalue, newvalue);
	}
	
	$.fn.autoundo_del_mod_property=function(key){
		initPropCommand();
		var oldval=this.mod_property(key);
		this.del_mod_property(key);
		var oldvalue={propkey:key,propval:oldval,act:'del',cmdtype:'undo'}
		var newvalue={propkey:key,act:'del',cmdtype:'redo'}
		if(oldval != undefined)  new PropertyCommand(this.attr('id')).insertWithVals(oldvalue, newvalue);
	}
	
	$.fn.del_mod_property=function(key){
		var id=this.prop('id');
		if(!id) return null;
		var propertydata=mod_property[id];
		if($.isPlainObject(propertydata)){
			var oldval=propertydata[key];
			delete propertydata[key];
			return oldval;
		}
	}
	
	$.fn.get_mod_property=function(){
		var id=this.prop('id');
		if(!id) return null;
		var propertydata=mod_property[id];
		return propertydata||{};
	}
	
})(jQuery);