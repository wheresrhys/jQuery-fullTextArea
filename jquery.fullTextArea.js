// ----------------------------------------------------------------------------
// fullTextArea - A jQuery Plugin to enable even small text areas to be used to inpuy lage amounts of text easily
// v 0.3.2, requires jQuery 1.3.2 or later (may work with earlier versions, but untested)
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
// The plugin takes 5 optional parameters in JSON form:
// 		mode - default value = "focus" . Other possible values: "button" - changes whether the full screen textarea appears on focus or by clicking a button
//		cssClass - default value =  "fta_overlay". Other possible values: Any string you want as the class of eth containing div for the plugin
//		save_txt: "Save" -the text on the save button
//		undo_txt:"Start again" -the text on the undo changes button
//		cancel_txt:"Cancel" -  -the text on the cancel button
//  NEW IN VERSION 0.3.2 
//  - Fixed ie bug


// ----------------------------------------------------------------------------

jQuery.fn.fullTextArea = function(options) {
	
	var defaults = {
		mode: "focus",
		cssClass: "fta_overlay",
		save_txt: "Save",
		undo_txt:"Start again",
		cancel_txt:"Cancel"
	};
	var opts = $.extend(defaults, options);
	
	if(opts.mode == 'focus') {
		return this.each(function(){
			$(this).focus(createOverlay);
		});
	} else if(opts.mode == 'button') {
		return this.each(function(){
			createButton(this);
			$(this).siblings('input').click(createOverlay);
		});
	}

	function createButton(ta) {
		var tot_width =  $(ta).width();
		fsb = $('<input>').attr({type:'button',value:'Edit full screen'})
						.css({'margin-left':'5px', width:Math.max(tot_width/4,60)});
		$(ta).width((tot_width - Math.max(tot_width/4,60)) - 5)
			.wrap("<div></div>");
		$(ta).closest("div").append(fsb);
	}

	function createOverlay() {		
		//keep track of what is going to be changed
		var original = this;
		if(opts.mode === 'button')
		{
			original = $(this).siblings('textarea');
		}
		var text = $(original).val();

		//create transparent overlay
		var overlay = $('<div>').css({
			position:"absolute",
			"z-index":200,
			left:0,
			top:$(window).scrollTop(),
			width: $(window).width(),
			height: $(window).height(),
			'background-color':'black',
			opacity: '0.5'
		}).bgIframe();

		//create holder for elements
		var form_holder = $('<div>').css({
			position:"absolute",
			"z-index":202,
			left:0,
			top:$(window).scrollTop(),
			width: $(window).width(),
			height: $(window).height(),
			'background-color':'transparent'
		}).addClass(opts.cssClass);

		//create large textarea
		var textarea = $('<textarea>').text(text)
		.css({
			width:$(window).width()*0.6,
			height:$(window).height()*0.8,
			'left':$(window).width()*0.2,
			'top':$(window).height()*0.1,
			position:'absolute',
			background:'#f8f8f8',
			border:'1px solid #020202'
		});

		//preselect text
		$(textarea).focus(function() {
			if(this.value == $(original).text())//text holds the default value
			{
				this.select();
			}
		});

		//create buttons
		var buttons = $('<div>').addClass("fta_buttons").css({
			position:"absolute",
			width: $(window).width()*0.2,
			bottom:$(window).height()*0.1,
			right:0,
			'margin-bottom':'-3px'
		});

		var save = $('<input>').attr({
			type: "button",
			value: opts.save_txt
		}).css({width:'45%'});

		var cancel = $('<input>').attr({
			type: "button",
			value: opts.cancel_txt
		}).css({width:'45%'});

		var undo = $('<input>').attr({
			type: "button",
			value: opts.undo_txt
		}).css({width:'93%'});

		//add elements to document
		$(buttons).append(undo);
		$(buttons).append(cancel);
		$(buttons).append(save);
		$(form_holder).append(textarea);
		$(form_holder).append(buttons);
		$("body").append(overlay);
		$("body").append(form_holder); 
		$(textarea).focus();

		//make sure stays visible even when scrolling
		$(window).scroll(function () { 
			$(overlay).css({
				top:$(window).scrollTop(),
				height:$(window).height()
			});
			$(textarea).css({                
				'top':$(window).height()*0.1,
				height:$(window).height()*0.8
			});
			$(form_holder).css({
				'top':$(window).scrollTop(),
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
			$(textarea).focus(function() {
			if(this.value == $(original).text())
				{
					this.select();
				}
			});
			$(textarea).focus(); 
		});		
	};
};