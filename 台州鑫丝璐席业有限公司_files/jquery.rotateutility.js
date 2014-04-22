(function( $, undefined ) {
	var sin_cache={0:0};
	var cos_cache={0:1};
	var tan_cache={0:0};
	
	$.math={};
	$.math.sin=function(degree){
		if(degree<0) degree=degree+360;
		if(degree>=360) degree=degree%360;
		if(sin_cache[degree]==undefined){
			var value=Math.sin(degree*Math.PI/180);
			sin_cache[degree]=value;
		}
		return sin_cache[degree];
	}
	
	$.math.cos=function(degree){
		if(degree<0) degree=degree+360;
		if(degree>=360) degree=degree%360;
		if(cos_cache[degree]==undefined){
			var value=Math.cos(degree*Math.PI/180);
			cos_cache[degree]=value;
		}
		return cos_cache[degree];
	}
	
	$.math.tan=function(degree){
		if(degree<0) degree=degree+360;
		if(degree>=360) degree=degree%360;
		if(tan_cache[degree]==undefined){
			var value=Math.tan(degree*Math.PI/180);
			tan_cache[degree]=value;
		}
		return tan_cache[degree];
	}
	
	$.math.acos=function(cosdegree){
		var deg=Math.acos(cosdegree);
		return Math.round(deg*180/Math.PI);
	}
	
	$.parseInteger = function(str){
		var i = parseInt(str);
		if(isNaN(i)) return 0;
		return i;
	}
	
	//跨浏览器旋转css设置	
	$.divrotate=function(dom,degree,initpos,sizearr){
		dom=$(dom);
		var w=dom.width();
		var h=dom.height();
		if(sizearr){
			w=sizearr[0];
			h=sizearr[1];
		}
		
		if(initpos){
			var left=initpos[0];
			var top=initpos[1];
			
			if($.browser.msie && $.browser.version < 9){
				w = parseInt(dom.data('IEWidth'));
				h = parseInt(dom.data('IEHeight'));
				
				left = dom.data('IELeft');
				if(left == undefined)
				{
					left = initpos[0];
					dom.data('IELeft',left);
				}
				
				top = dom.data('IETop');
				if(top == undefined)
				{
					top = initpos[1];
					dom.data('IETop',top);
				}
				
				ieRotate({
					degree:degree,
					left:left,
					top:top,
					width:w,
					height:h,
					dom:dom
				});
			}else{
				dom[0].style.left=Math.round(left)+'px';
				dom[0].style.top=Math.round(top)+'px';
			}
		}
		
		if($.browser.safari || $.browser.mozilla || $.browser.opera || ($.browser.msie && $.browser.version == '9.0')){
			ieRotate({
				degree:degree,
				dom:dom
			});
		}
	}
	
	$.fn.modattr=function(keyname,value){
		if(keyname=='leftpos'){
			var oldpos=this.data('prop_leftpos');
			if(!oldpos){
				oldpos=[parseInt(this.css('left')),parseInt(this.css('top'))];
			}
			if(value!=undefined) this.data('prop_leftpos',value);
			return oldpos;
		}
		if(keyname=='degree'){
			var oldpos=this.data('deg');
			if(!oldpos){
				oldpos=0;
			}
			if(value!=undefined) this.data('deg',value);
			return oldpos;
		}
		
		if(keyname=='size'){
			var oldpos=this.data('prop_size');
			if(!oldpos){
				oldpos=[this.width(),this.height()];
			}
			if(value!=undefined) this.data('prop_size',value);
			return oldpos;
		}
	}
	
	//IE实际左点和定位的左点转换函数
	$.divrotate.reversePos=function(pos,degree,w,h){
				var left=pos[0];
				var top=pos[1];
				var costheta = $.math.cos(degree);
				var sintheta = $.math.sin(degree);
				if($.browser.msie && $.browser.version < 9){
					var newl=left;
					if(degree<90) newl=left+h*sintheta;
					else if(degree<180) newl=left+h*sintheta-w*costheta;
					else if(degree<270) newl=left-w*costheta;
					else newl=left;

					var newt=top;
					if(degree<90) newt=top;
					else if(degree<180) newt=top-h*costheta;
					else if(degree<270) newt=top-h*costheta-w*sintheta;
					else newt=top-w*sintheta;
					return [newl,newt];
				}else{
					return pos;
				}
		}
		
		//计算旋转模块离各个边界的距离
		$.divrotate.getMaxDistance=function(dom){
			var degree=dom.data('deg');
			var left=parseInt(dom.css('left'));
			var top=parseInt(dom.css('top'));
			
			var w=dom.width();
			var h=dom.height();
			var canvaswidth = canv.width();
			var maxleft,maxright,maxtop;
			
			//没有旋转
			if(!degree){
				maxleft=left;
				maxright=canvaswidth-w-left;
				maxtop=top;
			}else{
				if(degree>360) degree=degree%360;
				var cosa=$.math.cos(degree);
				var sina=$.math.sin(degree);
				if(degree<=90){
					maxleft=left-h*sina;
					maxright=canvaswidth-left-w*cosa;
					maxtop=top;
				}else if(degree>90 && degree<=180){
					maxleft=left-h*sina+w*cosa;
					maxright=canvaswidth-left;
					maxtop=top+h*cosa;
				}else if(degree>180 && degree<=270){
					maxleft=left+w*cosa;
					maxright=canvaswidth-left+h*sina;
					maxtop=top+h*cosa+w*sina;
				}else if(degree>270 && degree<=360){
					maxleft=left;
					maxright=canvaswidth-left+h*sina-w*cosa;
					maxtop=top+w*sina;
				}
			}
			return {left:maxleft,right:maxright,top:maxtop};
			
		}
		
		//计算旋转模块
		//postype: left right,top, buttom
		$.divrotate.getDegreeModMaxPointOrigin=function(dom,degree,pos,sizearr,postype){
			var fatherid=$.getElementFatherid(dom);
			var fathertoppos=$('#'+fatherid).ab_pos_cnter('top');
			var degree=degree;
			//没有旋转
			if(!degree){
				var maxval=0;
				var w=sizearr[0];
				var h=sizearr[1];
				switch (postype) {
					case 'left':
						maxval=pos[0];
						break;
					case 'right':
						maxval=pos[0]+w;
						break;
					case 'top':
						maxval=pos[1]+fathertoppos;
						break;
					case 'buttom':
						maxval=pos[1]+h+fathertoppos;
						break;
				}
				return maxval;

			}else{
				if($.browser.msie && $.browser.version < 9){
					var maxval=0;
					switch (postype) {
						case 'left':
							maxval = dom.position().left;
							break;
						case 'right':
							maxval = dom.position().left+dom.width();
							break;
						case 'top':
							maxval = dom.position().top;
							break;
						case 'buttom':
							maxval = dom.position().top+dom.height();
							break;
					}
					return maxval;
				}
				var maxval=0;
				var w=sizearr[0];
				var h=sizearr[1];
				var l=pos[0];
				var t=pos[1];
				if(degree>360) degree=degree%360;
				var cosa=$.math.cos(degree);
				var sina=$.math.sin(degree);
				switch (postype) {
					case 'left':
						if(degree<=90){
							maxval=l-h*sina;
						}else if(degree>90 && degree<=180){
							maxval=l-h*sina+w*cosa;
						}else if(degree>180 && degree<=270){
							maxval=l+w*cosa;
						}else if(degree>270 && degree<=360){
							maxval=l;
						}
						break;
					case 'right':
						if(degree<=90){
							maxval=l+w*cosa;
						}else if(degree>90 && degree<=180){
							maxval=l;
						}else if(degree>180 && degree<=270){
							maxval=l-h*sina;
						}else if(degree>270 && degree<=360){
							maxval=l-h*sina+w*cosa;
						}
						break;
					case 'top':
						if(degree<=90){
							maxval=t;
						}else if(degree>90 && degree<=180){
							maxval=t+h*cosa;
						}else if(degree>180 && degree<=270){
							maxval=t+h*cosa+w*sina;
						}else if(degree>270 && degree<=360){
							maxval=t+w*sina;
						}
						maxval=maxval+fathertoppos;
						break;
					case 'buttom':
						if(degree<=90){
							maxval=t+h*cosa+w*sina;
						}else if(degree>90 && degree<=180){
							maxval=t+w*sina;
						}else if(degree>180 && degree<=270){
							maxval=t;
						}else if(degree>270 && degree<=360){
							maxval=t+h*cosa;
						}
						maxval=maxval+fathertoppos;
						break;
				}
				return maxval;
			}
		}
		
		//计算旋转模块
		//postype: left right,top, buttom
		$.divrotate.getDegreeModMaxPoint=function(dom,pos,postype){
			var degree=dom.data('deg');
			if(pos==null) pos=[$.parseInteger(dom.css('left')),$.parseInteger(dom.css('top'))]
			var w=dom.width();
			var h=dom.height();
			return $.divrotate.getDegreeModMaxPointOrigin(dom,degree,pos,[w,h],postype);

		}
		
		//计算旋转模块
		//postype: left right,top, buttom
		$.divrotate.getDegreeModMaxPointForRotate=function(dom,degree,pos,postype){
			var w=dom.width();
			var h=dom.height();
			return $.divrotate.getDegreeModMaxPointOrigin(dom,degree,pos,[w,h],postype);

		}
		
		// Get Resize Mouse Cursor
		$.divrotate.getDegreeResizeCursor=function(dom){
			var degree=dom.data('deg');
			if(degree==null) degree=0;
			if(degree>360) degree=degree%360;
			
			if(degree<=22||degree>=338){
				dom.find('.ui-resizable-n').css('cursor','n-resize');
				dom.find('.ui-resizable-e').css('cursor','e-resize');
				dom.find('.ui-resizable-w').css('cursor','w-resize');
				dom.find('.ui-resizable-s').css('cursor','s-resize');
				dom.find('.ui-resizable-ne').css('cursor','ne-resize');
				dom.find('.ui-resizable-se').css('cursor','se-resize');
				dom.find('.ui-resizable-nw').css('cursor','nw-resize');
				dom.find('.ui-resizable-sw').css('cursor','sw-resize');
			}else if(degree>22&&degree<=67){
				dom.find('.ui-resizable-n').css('cursor','ne-resize');
				dom.find('.ui-resizable-e').css('cursor','se-resize');
				dom.find('.ui-resizable-w').css('cursor','nw-resize');
				dom.find('.ui-resizable-s').css('cursor','sw-resize');
				dom.find('.ui-resizable-ne').css('cursor','e-resize');
				dom.find('.ui-resizable-se').css('cursor','s-resize');
				dom.find('.ui-resizable-nw').css('cursor','n-resize');
				dom.find('.ui-resizable-sw').css('cursor','w-resize');
			}else if(degree>67&&degree<=112){
				dom.find('.ui-resizable-n').css('cursor','e-resize');
				dom.find('.ui-resizable-e').css('cursor','s-resize');
				dom.find('.ui-resizable-w').css('cursor','n-resize');
				dom.find('.ui-resizable-s').css('cursor','w-resize');
				dom.find('.ui-resizable-ne').css('cursor','se-resize');
				dom.find('.ui-resizable-se').css('cursor','sw-resize');
				dom.find('.ui-resizable-nw').css('cursor','ne-resize');
				dom.find('.ui-resizable-sw').css('cursor','nw-resize');
			}else if(degree>112&&degree<=157){
				dom.find('.ui-resizable-n').css('cursor','se-resize');
				dom.find('.ui-resizable-e').css('cursor','sw-resize');
				dom.find('.ui-resizable-w').css('cursor','ne-resize');
				dom.find('.ui-resizable-s').css('cursor','nw-resize');
				dom.find('.ui-resizable-ne').css('cursor','s-resize');
				dom.find('.ui-resizable-se').css('cursor','w-resize');
				dom.find('.ui-resizable-nw').css('cursor','e-resize');
				dom.find('.ui-resizable-sw').css('cursor','n-resize');
			}else if(degree>157&&degree<=202){
				dom.find('.ui-resizable-n').css('cursor','s-resize');
				dom.find('.ui-resizable-e').css('cursor','w-resize');
				dom.find('.ui-resizable-w').css('cursor','e-resize');
				dom.find('.ui-resizable-s').css('cursor','n-resize');
				dom.find('.ui-resizable-ne').css('cursor','sw-resize');
				dom.find('.ui-resizable-se').css('cursor','nw-resize');
				dom.find('.ui-resizable-nw').css('cursor','se-resize');
				dom.find('.ui-resizable-sw').css('cursor','ne-resize');
			}else if(degree>202&&degree<=247){
				dom.find('.ui-resizable-n').css('cursor','sw-resize');
				dom.find('.ui-resizable-e').css('cursor','nw-resize');
				dom.find('.ui-resizable-w').css('cursor','se-resize');
				dom.find('.ui-resizable-s').css('cursor','ne-resize');
				dom.find('.ui-resizable-ne').css('cursor','w-resize');
				dom.find('.ui-resizable-se').css('cursor','n-resize');
				dom.find('.ui-resizable-nw').css('cursor','s-resize');
				dom.find('.ui-resizable-sw').css('cursor','e-resize');
			}else if(degree>247&&degree<=292){
				dom.find('.ui-resizable-n').css('cursor','w-resize');
				dom.find('.ui-resizable-e').css('cursor','n-resize');
				dom.find('.ui-resizable-w').css('cursor','s-resize');
				dom.find('.ui-resizable-s').css('cursor','e-resize');
				dom.find('.ui-resizable-ne').css('cursor','nw-resize');
				dom.find('.ui-resizable-se').css('cursor','ne-resize');
				dom.find('.ui-resizable-nw').css('cursor','sw-resize');
				dom.find('.ui-resizable-sw').css('cursor','se-resize');
			}else if(degree>292&&degree<=337){
				dom.find('.ui-resizable-n').css('cursor','nw-resize');
				dom.find('.ui-resizable-e').css('cursor','ne-resize');
				dom.find('.ui-resizable-w').css('cursor','sw-resize');
				dom.find('.ui-resizable-s').css('cursor','se-resize');
				dom.find('.ui-resizable-ne').css('cursor','n-resize');
				dom.find('.ui-resizable-se').css('cursor','e-resize');
				dom.find('.ui-resizable-nw').css('cursor','w-resize');
				dom.find('.ui-resizable-sw').css('cursor','s-resize');
			}
		}
		
		// Get Resize Change Property
		$.divrotate.getDegreeResizeChange=function(dom,pos,oriPos,oriSize,postype){
			//pos[dx,dy]鼠标移动时与刚开始拉伸鼠标相对偏移量,oriPos[l,t]鼠标拖动前模块坐标,oriSize[w,h]鼠标拖动前模块宽高
			var degree=dom.data('deg');
			if(degree>360) degree=degree%360;
			
			var sinx = Math.sin(degree*Math.PI/180);
			var cosx = Math.cos(degree*Math.PI/180);
			if($.browser.msie && $.browser.version < 9)
			{
				//模块宽高
				var w = dom.data('IEWidth');
				var h = dom.data('IEHeight');
				//左上顶点坐标
				if(degree >= 0 && degree < 90)
					var l = oriPos.left + h*sinx,t = oriPos.top;
				else if(degree >= 90 && degree < 180)
					var l = h*sinx - w*cosx + oriPos.left,t = oriPos.top - h*cosx;
				else if(degree > 180 && degree <= 270)
					var l = oriPos.left - w*cosx,t = oriPos.top - w*sinx - h*cosx;
				else if(degree > 270 && degree < 360)
					var l = oriPos.left,t = w*cosx + oriPos.top;
			}
			else
			{
				var w=oriSize.width;
				var h=oriSize.height;
				var l=oriPos.left,t=oriPos.top;
			}
			
			//鼠标滑行偏移量
			var dx=pos[0];
			var dy=pos[1];
			
			var tana=$.math.tan(degree);
			var bgree,height,rotateOrigin;
			
			var heplerfunc=function(ypos){
				bgree=$.math.acos((dx+ypos*dy)/(Math.sqrt(dx*dx+dy*dy)*Math.sqrt(1+ypos*ypos)));
				height=Math.sqrt(dx*dx+dy*dy)*$.math.sin(bgree);
				rotateOrigin=dx*ypos-dy;
			}
			
			var heplerfunc2=function(ypos){
				bgree=$.math.acos((dx-ypos*dy)/(Math.sqrt(dx*dx+dy*dy)*Math.sqrt(1+ypos*ypos)));
				height=Math.sqrt(dx*dx+dy*dy)*$.math.sin(bgree);
				rotateOrigin=0-(dx*ypos+dy);
			}
			
			if($.browser.msie && $.browser.version < 9)
			{
				var return_str = null;
				switch (postype) {
					case 'n':
						heplerfunc(tana);
						if(rotateOrigin==0) return {};
						if(degree <= 90)
						{
							if(rotateOrigin>0){
								return_str = {height:Math.round(h+height),left:Math.round(l+height*$.math.sin(degree)-(h+height)*$.math.sin(degree)),top:Math.round(t-height*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {height:Math.round(h-height),left:Math.round(l-height*$.math.sin(degree)-(h-height)*$.math.sin(degree)),top:Math.round(t+height*$.math.cos(degree))}
							}
						}
						else if(degree>270 && degree<360)
						{
							if(rotateOrigin>0){
								return_str = {height:Math.round(h+height),left:Math.round(l+height*$.math.sin(degree)),top:Math.round(t-height*$.math.cos(degree)-w*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {height:Math.round(h-height),left:Math.round(l-height*$.math.sin(degree)),top:Math.round(t+height*$.math.cos(degree)-w*$.math.cos(degree))}
							}
						}
						else if(degree > 90 && degree <= 180)
						{
							if(rotateOrigin>0){
								return_str = {height:Math.round(h-height),left:Math.round(l-height*$.math.sin(degree)-(h-height)*$.math.sin(degree)+w*$.math.cos(degree)),top:Math.round(t+height*$.math.cos(degree)+(h-height)*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {height:Math.round(h+height),left:Math.round(l+height*$.math.sin(degree)-(h+height)*$.math.sin(degree)+w*$.math.cos(degree)),top:Math.round(t-height*$.math.cos(degree)+(h+height)*$.math.cos(degree))}
							}
						}
						else if(degree > 180 && degree <= 270)
						{
							if(rotateOrigin>0){
								return_str = {height:Math.round(h-height),left:Math.round(l-height*$.math.sin(degree)+w*$.math.cos(degree)),top:Math.round(t+height*$.math.cos(degree)+(h-height)*$.math.cos(degree)+w*$.math.sin(degree))}
							}else if(rotateOrigin<0){
								return_str = {height:Math.round(h+height),left:Math.round(l+height*$.math.sin(degree)+w*$.math.cos(degree)),top:Math.round(t-height*$.math.cos(degree)+(h+height)*$.math.cos(degree)+w*$.math.sin(degree))}
							}
						}
						break;
					case 's':
						heplerfunc(tana);
						if(rotateOrigin==0) return {};
						if(degree <= 90)
						{
							if(rotateOrigin>0){
								return_str = {width:w,height:Math.round(h-height),left:Math.round(l-(h-height)*$.math.sin(degree)),top:t}
							}else if(rotateOrigin<0){
								return_str = {width:w,height:Math.round(h+height),left:Math.round(l-(h+height)*$.math.sin(degree)),top:t}
							}
						}
						else if(degree > 90 && degree <= 180)
						{
							if(rotateOrigin>0){
								return_str = {width:w,height:Math.round(h+height),left:Math.round(l-(h+height)*$.math.sin(degree)+w*$.math.cos(degree)),top:Math.round(t+(h+height)*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:w,height:Math.round(h-height),left:Math.round(l-(h-height)*$.math.sin(degree)+w*$.math.cos(degree)),top:Math.round(t+(h-height)*$.math.cos(degree))}
							}
						}
						else if(degree > 180 && degree <= 270)
						{
							if(rotateOrigin>0){
								return_str = {width:w,height:Math.round(h+height),left:Math.round(l+w*$.math.cos(degree)),top:Math.round(t+(h+height)*$.math.cos(degree)+w*$.math.sin(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:w,height:Math.round(h-height),left:Math.round(l+w*$.math.cos(degree)),top:Math.round(t+(h-height)*$.math.cos(degree)+w*$.math.sin(degree))}
							}
						}
						else if(degree>270 && degree<360)
						{
							if(rotateOrigin>0){
								return_str = {width:w,height:Math.round(h-height),left:l,top:Math.round(t-w*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:w,height:Math.round(h+height),left:l,top:Math.round(t-w*$.math.cos(degree))}
							}
						}
						break;
					case 'w':
						heplerfunc2(1/tana);
						if(rotateOrigin==0) return {};
						if(degree <= 90)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w+height),height:h,left:Math.round(l-height*$.math.cos(degree)-h*$.math.sin(degree)),top:Math.round(t-height*$.math.sin(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w-height),height:h,left:Math.round(l+height*$.math.cos(degree)-h*$.math.sin(degree)),top:Math.round(t+height*$.math.sin(degree))}
							}
						}
						else if(degree > 90 && degree <= 180)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w+height),height:h,left:Math.round(l-height*$.math.cos(degree)-h*$.math.sin(degree)+(w+height)*$.math.cos(degree)),top:Math.round(t-height*$.math.sin(degree)+h*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w-height),height:h,left:Math.round(l+height*$.math.cos(degree)-h*$.math.sin(degree)+(w-height)*$.math.cos(degree)),top:Math.round(t+height*$.math.sin(degree)+h*$.math.cos(degree))}
							}
						}
						else if(degree > 180 && degree <= 270)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w-height),height:h,left:Math.round(l+height*$.math.cos(degree)+(w-height)*$.math.cos(degree)),top:Math.round(t+height*$.math.sin(degree)+(w-height)*$.math.sin(degree)+h*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w+height),height:h,left:Math.round(l-height*$.math.cos(degree)+(w+height)*$.math.cos(degree)),top:Math.round(t-height*$.math.sin(degree)+(w+height)*$.math.sin(degree)+h*$.math.cos(degree))}
							}
						}
						else if(degree > 270 && degree < 360)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w-height),height:h,left:Math.round(l+height*$.math.cos(degree)),top:Math.round(t+height*$.math.sin(degree)-(w-height)*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w+height),height:h,left:Math.round(l-height*$.math.cos(degree)),top:Math.round(t-height*$.math.sin(degree)-(w+height)*$.math.cos(degree))}
							}
						}
						break;
					case 'e':
						heplerfunc2(1/tana);
						if(rotateOrigin==0) return {};
						if(degree <= 90)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w-height),height:h,left:l-h*$.math.sin(degree),top:t}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w+height),height:h,left:l-h*$.math.sin(degree),top:t}
							}
						}
						else if(degree > 90 && degree <= 180)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w-height),height:h,left:l-h*$.math.sin(degree)+(w-height)*$.math.cos(degree),top:t+h*$.math.cos(degree)}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w+height),height:h,left:l-h*$.math.sin(degree)+(w+height)*$.math.cos(degree),top:t+h*$.math.cos(degree)}
							}
						}
						else if(degree > 180 && degree <= 270)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w+height),height:h,left:l+(w+height)*$.math.cos(degree),top:t+(w+height)*$.math.sin(degree)+h*$.math.cos(degree)}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w-height),height:h,left:l+(w-height)*$.math.cos(degree),top:t+(w-height)*$.math.sin(degree)+h*$.math.cos(degree)}
							}
						}
						else if(degree > 270 && degree < 360)
						{
							if(rotateOrigin>0){
								return_str = {width:Math.round(w+height),height:h,left:l,top:t-(w+height)*$.math.cos(degree)}
							}else if(rotateOrigin<0){
								return_str = {width:Math.round(w-height),height:h,left:l,top:t-(w-height)*$.math.cos(degree)}
							}
						}
						break;
				}
				dom.data('IEWidth_tmp',return_str.width||w).data('IEHeight_tmp',return_str.height||h);
				$('.propblk,.posblk').remove();
				return return_str;
			}
			else
			{
				switch (postype) {
					case 'n':
						heplerfunc(tana);
						if(rotateOrigin==0) return {};
						if(degree<=90||(degree>270 && degree<=360)){
							if(rotateOrigin>0){
								return {height:Math.round(h+height),left:Math.round(l+height*$.math.sin(degree)),top:Math.round(t-height*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return {height:Math.round(h-height),left:Math.round(l-height*$.math.sin(degree)),top:Math.round(t+height*$.math.cos(degree))}
							}
						}else if(degree>90 && degree<=270){
							if(rotateOrigin>0){
								return {height:Math.round(h-height),left:Math.round(l-height*$.math.sin(degree)),top:Math.round(t+height*$.math.cos(degree))}
							}else if(rotateOrigin<0){
								return {height:Math.round(h+height),left:Math.round(l+height*$.math.sin(degree)),top:Math.round(t-height*$.math.cos(degree))}
							}
						}
						break;
					case 's':
						heplerfunc(tana);
						if(rotateOrigin==0) return {};
						if(degree<=90||(degree>270 && degree<=360)){
							if(rotateOrigin>0){
								return {height:Math.round(h-height)}
							}else if(rotateOrigin<0){
								return {height:Math.round(h+height)}
							}
						}else if(degree>90 && degree<=270){
							if(rotateOrigin>0){
								return {height:Math.round(h+height)}
							}else if(rotateOrigin<0){
								return {height:Math.round(h-height)}
							}
						}
						break;
					case 'w':
						heplerfunc2(1/tana);
						if(rotateOrigin==0) return {};
						if(degree<=180){
							if(rotateOrigin>0){
								return {width:Math.round(w+height),left:Math.round(l-height*$.math.cos(degree)),top:Math.round(t-height*$.math.sin(degree))}
							}else if(rotateOrigin<0){
								return {width:Math.round(w-height),left:Math.round(l+height*$.math.cos(degree)),top:Math.round(t+height*$.math.sin(degree))}
							}
						}else if(degree>180 && degree<=360){
							if(rotateOrigin>0){
								return {width:Math.round(w-height),left:Math.round(l+height*$.math.cos(degree)),top:Math.round(t+height*$.math.sin(degree))}
							}else if(rotateOrigin<0){
								return {width:Math.round(w+height),left:Math.round(l-height*$.math.cos(degree)),top:Math.round(t-height*$.math.sin(degree))}
							}
						}
						break;
					case 'e':
						heplerfunc2(1/tana);
						if(rotateOrigin==0) return {};
						if(degree<=180){
							if(rotateOrigin>0){
								return {width:Math.round(w-height)}
							}else if(rotateOrigin<0){
								return {width:Math.round(w+height)}
							}
						}else if(degree>180 && degree<=360){
							if(rotateOrigin>0){
								return {width:Math.round(w+height)}
							}else if(rotateOrigin<0){
								return {width:Math.round(w-height)}
							}
						}
						break;
				}
			}
		}
		
	
})(jQuery);
function rotateWithCenter(dom,degree){
	dom=$(dom);
	var oldpos=dom.modattr('leftpos');
		var oldleft=oldpos[0];
		var oldtop=oldpos[1];

	
	var olddegree=dom.modattr('degree');
	
	var w=dom.width();
	var h=dom.height();
	
	var sinolddegree=$.math.sin(olddegree);
	var cosolddegree=$.math.cos(olddegree);
	var centerPoint=[oldleft+w/2*cosolddegree-h/2*sinolddegree,oldtop+h/2*cosolddegree+w/2*sinolddegree];
	
	var sinnewdegree=$.math.sin(degree);
	var cosnewdegree=$.math.cos(degree);
	var newleft=centerPoint[0]+h/2*sinnewdegree-w/2*cosnewdegree;
	var newtop=centerPoint[1]-w/2*sinnewdegree-h/2*cosnewdegree;

	//dom.modattr('leftpos',[newleft,newtop]);
	//dom.modattr('size',[w,h]);
	$.divrotate(dom,degree,[newleft,newtop]);
	
	toolbarRotate(dom,degree,{w:w,h:h});
	
}

function toolbarRotate(dom,degree,domSize){
	if($(".propblk").length==0) return;
	dom=$(dom);
	var sizearr=dom.data('toolbarsize');
	if(!sizearr){
		sizearr=[$(".propblk").width(),$(".propblk").height()];
		dom.data('toolbarsize',sizearr);
	}
	
	if($.browser.msie && $.browser.version < 9)
	{
		var pw = sizearr[0];
		var ph = sizearr[1];
		var w = $("#"+dom.attr('id')).width();
		var h = $("#"+dom.attr('id')).height();
		var left = $.resetModToolbarLeft($("#"+dom.attr('id')).position().left);
		var top = $("#"+dom.attr('id')).position().top;
		var angle = degree % 360;
		var oldModW = dom.data('IEWidth');
		var oldModH = dom.data('IEHeight'); 
		
		if(dom.data('sinx') == undefined)
		{
			var rotation = Math.PI * angle / 180;
			var cosx = Math.cos(rotation);
			var sinx = Math.sin(rotation);
			dom.data('sinx',sinx);
			dom.data('cosx',cosx);
		}
		else//获取模块三角函数值，不需要在属性栏旋转重新计算
		{
			var cosx = dom.data('cosx');
			var sinx = dom.data('sinx');
		}
		
		if(angle > 0 && angle <= 90)
		{
			var propLeftNew = (w+left)-ph*sinx;
			var propTopNew = top+(h-oldModH*cosx);
		}
		else if(angle > 90 && angle <= 180)
		{
			var propLeftNew = w + left - (ph*sinx-pw*cosx) - (-1*cosx*oldModW);
			var propTopNew =h + top + ph*cosx;
		}
		else if(angle > 180 && angle <= 270)
		{
			var propLeftNew = left+pw*cosx;
			var propTopNew = top-oldModH*cosx+ph*cosx+pw*sinx;
		}
		else if(angle > 270 && angle < 360)
		{
			var propLeftNew = left+oldModW*cosx;
			var propTopNew = top+pw*sinx;
		}
		$(".propblk").css({filter : "progid:DXImageTransform.Microsoft.Matrix(M11="+cosx+",M12="+(-sinx)+",M21="+sinx+",M22="+cosx+",SizingMethod='auto expand')",'left':propLeftNew+'px','top':propTopNew+'px'});
	}
	else
	{
		var oldsize=dom.data('prop_size');
		var w=0;
		if(oldsize){
			w=oldsize[0];
		}else{
			w=dom.width();
		}
		
		if(!degree) degree=0;
		var oldpos=dom.data('prop_leftpos');
		var oldleft=parseInt(dom.css('left'));
		var oldtop=parseInt(dom.css('top'));
		if(oldpos){
			oldleft=oldpos[0];
			oldtop=oldpos[1];
		}

		var h=35;
		var left1 = $.math.sin(degree)*h + $.resetModToolbarLeft(parseInt(oldleft))+canv.offset().left;
		var top1 =  parseInt(oldtop)-$.math.cos(degree)*h+$('#'+$.getElementFatherid(dom)).ab_pos_cnter('top');
		$.divrotate($(".propblk"),degree,[left1,top1],sizearr);
	}
}

function modPosRotate(dom,degree,domSize){
	if($(".posblk").length==0) return;
	dom=$(dom);
	var sizearr=dom.data('modpossize');
	if(!sizearr){
		sizearr=[$(".posblk").width(),$(".posblk").height()];
		dom.data('modpossize',sizearr);
	}
	
	if(!degree) degree=0;
	var oldpos=dom.data('prop_leftpos');
	var oldleft=parseInt(dom.css('left'));
	var oldtop=parseInt(dom.css('top'));
	if(oldpos){
		oldleft=oldpos[0];
		oldtop=oldpos[1];
	}
	
	dom.data('deg',degree);
	$(".posblk").find('.posblk-position').html(Math.round(oldleft)+","+Math.round(oldtop)).andSelf().find('.posblk-deg').html(dom.data('deg')%360);
	
	
	if($.browser.msie && $.browser.version < 9)
	{
		var pow = sizearr[0];
		var poh = sizearr[1];
		var w = $("#"+dom.attr('id')).width();
		var h = $("#"+dom.attr('id')).height();
		var left = $("#"+dom.attr('id')).position().left;
		var top = $("#"+dom.attr('id')).position().top;
		var angle = degree % 360;
		var oldModW = dom.data('IEWidth');
		var oldModH = dom.data('IEHeight');
		if(dom.data('sinx') == undefined)
		{
			var rotation = Math.PI * angle / 180;
			var cosx = Math.cos(rotation);
			var sinx = Math.sin(rotation);
			dom.data('sinx',sinx);
			dom.data('cosx',cosx);
		}
		else//获取模块三角函数值，不需要在属性栏旋转重新计算
		{
			var cosx = dom.data('cosx');
			var sinx = dom.data('sinx');
		}
		
		if(angle >= 0 && angle <= 90)
		{
			var posLeftNew = left + oldModH*sinx;
			var posTopNew = top - poh*cosx;
		}
		else if(angle > 90 && angle <= 180)
		{
			var posLeftNew = left + w + pow*cosx;
			var posTopNew = top - oldModH*cosx;
		}
		else if(angle > 180 && angle <= 270)
		{
			var posLeftNew = left - oldModW*cosx + pow*cosx + poh*sinx;
			var posTopNew = top + h + pow*sinx;
		}
		else if(angle > 270 && angle < 360)
		{
			var posLeftNew = left + poh*sinx;
			var posTopNew = top - oldModW*sinx-poh*cosx+pow*sinx;
		}
		$(".posblk").css({filter : "progid:DXImageTransform.Microsoft.Matrix(M11="+cosx+",M12="+(-sinx)+",M21="+sinx+",M22="+cosx+",SizingMethod='auto expand')",'left':posLeftNew+'px','top':posTopNew+'px'});
	}
	else
	{
//		var h=$(".posblk").height()+2;
//		var left1 = $.math.sin(degree)*h + parseInt(oldleft)+canv.offset().left;
//		var top1 =  parseInt(oldtop)-$.math.cos(degree)*h+$('#'+$.getElementFatherid(dom)).ab_pos_cnter('top');
//		$.divrotate($(".posblk"),degree,[left1,top1],sizearr);
		var oldsize=dom.data('prop_size');
		var w=0;
		if(oldsize){
			w=oldsize[0] + 10;
		}else{
			w=dom.width() + 10;
		}
		var left1 = $.math.cos(degree)*w + parseInt(oldleft)+canv.offset().left;
		var top1 =  $.math.sin(degree)*w + parseInt(oldtop)+$('#'+$.getElementFatherid(dom)).ab_pos_cnter('top');
	
		$.divrotate($(".posblk"),degree,[left1,top1],sizearr);
	}
}

//ie下根据模块实际宽高获取模块在0度时的左上顶点
function getOldProxyFromSize(dom,degree,w,h)
{
	var angle = degree % 360;
	var oldX = $("#"+dom.attr('id')).position().left;
	var oldY = $("#"+dom.attr('id')).position().top;
	var newDom = $("#"+dom.attr('id'));
	if(dom.data('sinx') == undefined)
	{
		var rotation = Math.PI * angle / 180;
		var cosx = Math.cos(rotation);
		var sinx = Math.sin(rotation);
		dom.data('sinx',sinx);
		dom.data('cosx',cosx);
	}
	else
	{
		var sinx = dom.data('sinx');
		var cosx = dom.data('cosx');
	}
	
	if(angle == 0)
	{
		var x = oldX;
		var y = oldY;
	}
	else if(angle >= 0 && angle <= 90)
	{
		var x = (h*sinx+w*cosx-w)/2+oldX;
		var y = (w*sinx+h*cosx-h)/2+oldY;
	}
	else if(angle > 90 && angle <= 180)
	{
		var x = (h*sinx-w*cosx-w)/2+oldX;
		var y = (w*sinx-h*cosx-h)/2+oldY;
	}
	else if(angle > 180 && angle <= 270)
	{
		var x = (-1*h*sinx-w*cosx-w)/2+oldX;
		var y = (-1*w*sinx-h*cosx-h)/2+oldY;
	}
	else if(angle > 270 && angle < 360)
	{
		var x = (-1*h*sinx+w*cosx-w)/2+oldX;
		var y = (-1*w*sinx+h*cosx-h)/2+oldY;
	}
	
	return [x,y];
}

//ie下获取左上顶点与标准浏览器兼容
function getLeftPointProxy(dom,degree)
{
	var angle = degree % 360;
	var x0 = dom.position().left,y0 = dom.position().top;//[x0,y0]ie下面的左上顶点需要转换成标准浏览器顶点
	var reg = Math.PI * angle / 180;
	var sinx = Math.sin(reg),cosx = Math.cos(reg);
	var w = dom.data('IEWidth'),h = dom.data('IEHeight');
	if(angle >= 0 && angle < 90)
		return [Math.round(x0+h*sinx),Math.round(y0)];
	else if(angle >= 90 && angle < 180)
		return [Math.round(x0+h*sinx-w*cosx),Math.round(y0-h*cosx)];
	else if(angle > 180 && angle <= 270)
		return [Math.round(x0-w*cosx),Math.round(y0-h*cosx-w*sinx)];
	else if(angle > 270 && angle < 360)
		return [Math.round(x0),Math.round(y0-w*sinx)];
}