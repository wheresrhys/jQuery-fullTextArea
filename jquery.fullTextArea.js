// ----------------------------------------------------------------------------
// fullTextArea - A jQuery Plugin to enable even small text areas to be used to inpuy lage amounts of text easily
// v 0.4, requires jQuery 1.3.2 or later (may work with earlier versions, but untested)
//
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) 2009 Rhys Evans
// http://wheresrhys.co.uk/resources/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------
// DOCUMENTATION
// To apply the plug-in to a <textarea> tag/some <textarea> tags add the line, eg 
//
//           $('textarea').crossSelect(); 
//  
// The plugin takes 6 optional parameters in JSON form:
// 		mode - default value = "focus" . Other possible values: "button" - changes whether the full screen textarea appears on focus or by clicking a button
//		cssClass - default value =  "fta_overlay". Other possible values: Any string you want as the class of eth containing div for the plugin
//		save_txt: "Save" -the text on the save button
//		undo_txt:"Start again" -the text on the undo changes button
//		cancel_txt:"Cancel" -  -the text on the cancel button
//		editFS_text:"Edit full screen" - the text on the edit full screen button
//
//		eg $('textarea').crossSelect({undo_txt:'Undo your changes so far', mode:'button'}); 
//  
//  NEW IN VERSION 0.4 
//  - Shouldn't conflict with other frameworks using the $ shorthand
//  - Lots of optimisation


// ----------------------------------------------------------------------------

(function($) { 
	$.fn.fullTextArea = function(options) {
		this.defaults = {
			mode: "focus",
			cssClass: "fta_overlay",
			save_txt: "Save",
			undo_txt:"Start again",
			cancel_txt:"Cancel",
			editFS_txt:"Edit full screen",
		};
		
		var pars = $.extend(this.defaults, options);
		
		if(pars.mode == 'focus') {
			return this.each(function(){
				$(this).focus(createOverlay);
			});
		} else if(pars.mode == 'button') {
			return this.each(function(){
				createButton(this);
				$(this).siblings('input').click(createOverlay);
			});
		}

		function createButton(ta) {
			var tot_width =  $(ta).width();
			$(ta).width((tot_width - Math.max(tot_width/4,60)) - 5)
				   .wrap("<div></div>")
				   .parent().append('<input type="button" value="'+pars.editFS_txt+'" style="margin-left:5px; width:'+Math.max(tot_width/4,60)+'px">');
		}

		function createOverlay() {		
			//keep track of what is going to be changed
			var original = this;
			if(pars.mode === 'button')
			{
				original = $(this).siblings('textarea');
			}
			var text = $(original).val();

			//create transparent overlay
			var overlay = $('<div style="position:absolute;z-index:200;left:0;background-color:black;opacity:0.5; top:'+$(window).scrollTop()+'px;width:'+$(window).width()+'px;height:'+$(window).height()+'px">').bgIframe();

			//add elements to document
			var form_holder = $('<div style="position:absolute;z-index:202;left:0;background-color:transparent; top:'+$(window).scrollTop()+'px;width:'+$(window).width()+'px;height:'+$(window).height()+'px" class="'+pars.cssClass+'"><textarea style="width:'+$(window).width()*0.6+'px;height:'+$(window).height()*0.8+'px;left:'+$(window).width()*0.2+'px;top:'+$(window).height()*0.1+'px;	position:absolute;background:#f8f8f8;	border:1px solid #020202" value="'+text+'">'+text+'</textarea><div class="fta_buttons" style="position:absolute;width:'+$(window).width()*0.2+'px;bottom:'+$(window).height()*0.1+'px;right:0px;margin-bottom:-3px"><input type="button" class="undo" value="'+pars.undo_txt+'" style="width:93%" /><input type="button" class="cancel" value="'+pars.cancel_txt+'" style="width:45%" /><input type="button" class="save" value="'+pars.save_txt+'" style="width:45%" /></div></div>');
			$("body").append(overlay);
			$("body").append(form_holder);
			
			//keep track of important dom elements
			var textarea = $('textarea', form_holder)[0];
			var buttons = $('.fta_buttons', form_holder);
			var save = $('.save',buttons);
			var cancel = $('.cancel',buttons);
			var undo = $('.undo',buttons);
			$(textarea).focus();
			
			//preselect text
			$(textarea).focus(preselectText());
			
			function preselectText() {
				if(textarea.value == $(original).text())//text holds the default value
				{
					textarea.select();
				}
			}			
			
			//make sure stays visible even when scrolling
			$(window).scroll(function () { 
				$(overlay).css({
					top:$(window).scrollTop(),
					height:$(window).height()
				});
				$(textarea).css({                
					top:$(window).height()*0.1,
					height:$(window).height()*0.8
				});
				$(form_holder).css({
					top:$(window).scrollTop(),
					height:$(window).height()
				});                 
			});

			//handle button clicks
			$(cancel).click(function() {
				$(overlay).remove();
				$(form_holder).remove();
			});   
			$(save).click(function() {
				$(original).val($(textarea).val());
				$(overlay).remove();
				$(form_holder).remove();
			});
			$(undo).click(function() {
				$(textarea).val(text);
				//$(textarea).focus(preselectText);
				$(textarea).focus(); 
			});		
		};
	};
})(jQuery);