var scale = 1
var hotspot = function (data) {

	var txtdata = jqnc('<div>', {
		'class': 'hotspot-txt'
	});
	var imagePreCount = 0;
	var imgPreloadArray = new Array();
	var hotspotSpaceLeft = 40;
	var hotspotWidth = 150;
	var lastFocus = null;
	var myScroll;
	var loadingDiv;

	function preloadImage() {
		jqnc(data).css('visibility', 'hidden')
		loadingDiv = jqnc("<div/>")
		loadingDiv.css("position", "absolute")
		loadingDiv.css("left", "190px")
		loadingDiv.css("top", "250px")
		loadingDiv.css("font-size", "30px")
		loadingDiv.html("loading images..." + imagePreCount + "/" + imgPreloadArray.length)
		jqnc("body").append(loadingDiv)
		jqnc(data).find('.imagehighlights [data-img-src]').each(function () {
			imgPreloadArray.push(jqnc(this).attr('data-img-src'));
		});
		//console.log('imgPreloadArray '+ imgPreloadArray) ;
		for (var pId = 0; pId < imgPreloadArray.length; pId++) {
			var img = new Image();
			img.onload = imagePreloaded;
			img.src = imgPreloadArray[pId];
		}
	}

	function imagePreloaded() {
		imagePreCount++;
		if (imagePreCount == imgPreloadArray.length) {
			activate();
		}
		loadingDiv.html("loading images..." + imagePreCount + "/" + imgPreloadArray.length)
	}

	preloadImage();

	function activate() {
		addButtonEvents()
		hideAllHighlights()
		setupPopup()
		jqnc(data).find('.imageContainer').append(txtdata);
		setParameters();
		addImageAltText();
		/*setupSlider();
		setTimeout(function(){
	      jqnc(data).find('.ui-slider-handle').addClass('customPlayhead').addClass('tabindex');
	      jqnc(data).find('.ui-slider,.ui-slider-range').addClass('sliderRange');
	    },100);*/
		setTimeout(function () {
			myScroll = new IScroll('#zoomWrapper', {
				keyBindings: true,
				scrollbars: true,
				scrollX: true,
				scrollY: true,
				zoomMin: 1,
				zoomMax: 2,
				zoom: true
			});
			jqnc(loadingDiv).remove()
			jqnc(data).css('visibility', 'visible')
		}, 100);
		updateAriaAttributes();
	}

	function addImageAltText() {
		var altTextStr = 'This is an image of -imgtitle-, which includes self-assessment for the following items; -listlabels-.';
		var listStr = "";
		var iCtr = 1;
		var listLbl = jqnc("#popup_text_" + iCtr);
		while (listLbl.length > 0) {
			listLblTxt = jqnc.trim(listLbl.text());
			++iCtr;
			listLbl = jqnc("#popup_text_" + iCtr);

			if (listLbl.length > 0) {
				listStr += listLblTxt + ", ";
			} else {
				// listStr = listStr.substring(0, listStr.length-2);
				listStr = listStr + 'and ' + listLblTxt;
			}
		}
		altTextStr = altTextStr.replace("-imgtitle-", document.title);
		altTextStr = altTextStr.replace("-listlabels-", listStr);
		jqnc(".w-hotspot-img").attr("alt", altTextStr);
		//jqnc("#colorimg").attr("alt", altTextStr);
	}
	/*function setupSlider(){
		jqnc(data).find('#slider').slider({
		    orientation: 'horizontal',
		    range: 'min',  
		    min: 1,
		    max: 2,
		    step: 0.1,
		    value: 1,
		    slide: refreshScale,
		    change: refreshScale
		}).draggable();
		  
		function refreshScale(event, ui) {			
		    var scale = jqnc(data).find('#slider').slider('value');
		    myScroll.zoom(scale);
		}
	}*/

	function showText(txt, position, align, element) {
		var left = position.left;
		var top = position.top - 5;
		if (align == 'Left') {
			left = left - hotspotWidth;
		} else {
			left = left + hotspotSpaceLeft;
		}
		txtdata.css({
			'position': 'absolute',
			'left': left,
			'top': top * scale,
			'width': hotspotWidth,
			'height': 50
		})
		txtdata.html(txt)
	}

	function setupPopup() {
		//jqnc('.hotspot .popup').css('position','absolute')
	}

	function addButtonEvents() {
		//jqnc(data).find('.hotspot > div').bind('click keyup touchstart',onHotSpotClicked);	
		jqnc(data).find('.hotspot > button').bind('click', onHotSpotClicked);

		// Move labels ONLY if they are still inside .labelsdata (scoped)
		jqnc(data).find('.hotspot > button').each(function () {
			var id = jqnc(this).attr('data-id');
			var $label = jqnc(data).find('#popup_text_' + id);

			if ($label.length && $label.closest('.labelsdata').length) {
				jqnc(this).after($label);
			}
		});
		// Remove .labelsdata if empty
		jqnc(data).find('.labelsdata').each(function () {
			if (jqnc(this).children().length === 0) {
				jqnc(this).remove();
			}
		});
		
		jqnc(data).find('.hotspot > button').each(function () {
			//jqnc(this).attr('aria-label', jqnc(this).attr('data-popup'));
			jqnc(this).attr('aria-label', "label " + jqnc(this).attr('data-id'));
			jqnc(this).attr('aria-expanded', "false");
			jqnc(this).removeAttr('aria-describedby');
		});		
	}
	
	function hideAllHighlights() {
		jqnc(data).find('.imagehighlights > div').each(function () {
			var id = jqnc(this).attr('data-id')
			if ((id != 'bw') && (id != 'color') && (id != 'lines')) {
				jqnc(this).hide();
			}
		})
		//console.log("remove selected 1");
		jqnc(data).find('.hotspot > div').removeClass('selected');
		jqnc(data).find('.hotspot > button').removeClass('selected').attr("aria-expanded", "false").removeAttr("aria-describedby");
	}

	function showSelectedHigh(num) {
		//alert('showSelectedHigh');

		jqnc(data).find('.imagehighlights > div').each(function () {
			var id = jqnc(this).attr('data-id')
			if (id == 'color') {
				jqnc(this).hide();
			}
		});

		jqnc(data).find('.imagehighlights > div').each(function () {
			var id = jqnc(this).attr('data-id')
			if (id == num) {
				jqnc(this).show();
			}
		});
	}

	function onHotSpotClicked(e) {
		if (e.type == 'keyup' && (e.keyCode != 13))
			return false;
		lastFocus = jqnc(this);
		//console.log('lastFocus', lastFocus)

		if (!jqnc(e.target).hasClass("selected")) {
			hideAllHighlights()
			showSelectedHigh(jqnc(e.target).html());
			jqnc(e.target).find('.hotspot > button').addClass('notselected')
			jqnc(data).find('.hotspot_popup').hide().attr("aria-hidden", "true");

			jqnc(e.target).addClass('selected').attr("aria-expanded", "true");
			jqnc(e.target).attr("aria-describedby", 'popup_text_' + jqnc(e.target).attr('data-id'));
			jqnc('#popup_text_' + jqnc(e.target).attr('data-id')).show().attr("aria-hidden", "false");
		} else {
			hideAllHighlights()
			jqnc(data).find('.hotspot_popup').hide().attr("aria-hidden", "true");
		}
	}

	function setParameters() {
		var imgWidth = jqnc(data).find('.w-hotspot-img').width();
		var imgHeight = jqnc(data).find('.w-hotspot-img').height();
		jqnc(data).find('.imageContainer').css({
			'width': imgWidth + 'px',
			'height': '0px',
			'padding-bottom': imgHeight + 'px'
		})

		jqnc(data).find('.imagehighlights > div').css({
			'height': imgHeight + 'px'
		});
		if ((innerWidth > 0) && (innerWidth <= 340)) {
			hotspotSpaceLeft = 20;
			hotspotWidth = 70;
		} else if ((innerWidth > 340) && (innerWidth <= 500)) {
			hotspotSpaceLeft = 30;
			hotspotWidth = 100;
		} else {
			hotspotSpaceLeft = 40;
			hotspotWidth = 150;
		}
	}
	function updateAriaAttributes() {
		const elm_htspots = document.querySelectorAll("#zoomContainer .hotspot button");
		const elm_htspotslbls = document.querySelectorAll("#zoomContainer .hotspot div.hotspot_popup");
		
		elm_htspots.forEach(elmht => {
			elmht.setAttribute("role", "button");
		});
		
		elm_htspotslbls.forEach(elmhtlbl => {
			elmhtlbl.setAttribute("aria-live", "assertive");
		});
	}
}