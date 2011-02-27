jQuery.fn.fullTextArea = function(options) {
	
	var defaults = {
		mode: 'focus',
		class: ''
	};
	// Extend our default options with those provided.
	var opts = $.extend(defaults, options);
	if(opts.mode == 'focus') {
		return this.each(function(){
			$(this).focus(createOverlay);
		});
	} else if(opts.mode == 'button') {
		return this.each(function(){
			createButton(this);
			$(this).closest('div').children('input').click(createOverlay);
		});

		 //wrap textarea in div, shrink textarea width then put button aligned to button
			//	(this sibling button).click(createOverlay());	//go to parent then find the button	
	}

	function createButton(ta) {
		var tot_width =  $(ta).width();
		fsb = $('<input>').attr({type:'button',value:'Edit full screen'}).width(Math.max(tot_width/4,60)).css({'margin-left':'5px', width:Math.max(tot_width/4,60)});
		wrap = $("<div>")
		$(ta).width((tot_width - Math.max(tot_width/4,60)) - 5).wrap("<div></div>");
		$(ta).closest("div").append(fsb);
	}

	function createOverlay() {
		var original;
		var save ;
		var overlay;
		var textarea;
		var cancel;
		var undo;
		var text;
		var lang_texts;
		var form_holder;;
		
		//keep track of what is going to be changed
		original = this;
		if(opts.mode === 'button')
		{
			original = $(this).closest('div').children('textarea');
		}
		text = $(original).val();

		//create transparent overlay
		overlay = $('<div>').css({
			position:"absolute",
			"z-index":200,
			left:0,
			top:$(window).scrollTop(),
			width: $(window).width(),
			height: $(window).height(),
			'background-color':'black',
			opacity: '0.5'
		});

		//create holder for elements
		form_holder = $('<div>').css({
			position:"absolute",
			"z-index":202,
			left:0,//(  - $('.overlayBox').width() )/2,
			top:$(window).scrollTop(),//(  - $('.overlayBox').height() )/2 -20,
			width: $(window).width(),
			height: $(window).height(),
			'background-color':'transparent'
		}).addClass(opts.class);

		//create large textarea
		textarea = $('<textarea>').text(text)
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
		buttons = $('<div>').addClass("overlay_buttons").css({
			position:"absolute",
			width: $(window).width()*0.2,
			bottom:$(window).height()*0.1,
			right:0,
			'margin-bottom':'-3px'
		});

		save = $('<input>').attr({
			type: "button",
			value: "Save" //will need to get via ajax from text_texts, or from hidden content in page.
		}).css({width:'45%'});

		cancel = $('<input>').attr({
			type: "button",
			value: "Cancel" //will need to get via ajax from text_texts, or from hidden content in page.
		}).css({width:'45%'});

		undo = $('<input>').attr({
			type: "button",
			value: "Start again" //will need to get via ajax from text_texts, or from hidden content in page.
		}).css({width:'93%'});

		//add elements to document
		$(buttons).append(undo);
		$(buttons).append(cancel);
		$(buttons).append(save);
		$(form_holder).append(buttons);
		$(form_holder).append(textarea);
		$("body").append(overlay);
		$("body").append(form_holder); 
		if(/MSIE 6/i.test(navigator.userAgent))
			{
				$('select').css({visibility:'hidden'});
			}
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
			if(/MSIE 6/i.test(navigator.userAgent))
			{
				$('select').css({visibility:'visible'});
			}
		});   
		$(save).click(function() {
			$(original).val($(textarea).val());
			$(overlay).remove();
			$(form_holder).remove();
			if(/MSIE 6/i.test(navigator.userAgent))
			{
				$('select').css({visibility:'visible'});
			}
		});

		$(undo).click(function() {
			$(textarea).val(text);
			$(textarea).focus(function() {
			if(this.value == 'xxtext_hereyy')//get from hidden
				{
					this.select();
				}
			});
			$(textarea).focus(); 
		});		
	};
};





