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
			value: opts.save_text
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





