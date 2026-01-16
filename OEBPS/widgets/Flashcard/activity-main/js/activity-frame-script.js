jqnc(document).ready(function(){	    	
    fullscreenify();
});	    
function fullscreenify() {			
    pageHolder = document.getElementById('pageHolder')
    pageHolderWidth = jqnc('#pageHolder').width()
    pageHolderHeight = jqnc('#pageHolder').height()
    var style = pageHolder.getAttribute('style') || '';
    window.addEventListener('resize', function() {
        resize(pageHolder);
    }, false);
    resize(pageHolder, style);
}

function resize(pageHolder, style) {
   var scale = {
        x: 1,
        y: 1
    };
    
    var scaleX = window.innerWidth / pageHolderWidth;
    var scaleY = window.innerHeight / pageHolderHeight;

    // Use the smaller scale to preserve aspect ratio
    scale = Math.min(scaleX, scaleY);

    //console.log('scale', scale);

    var newWidth = scale * pageHolderWidth;
    var leftPos = (window.innerWidth - newWidth) / 2;
    //scale = Number(scale.split(','))[0];
    //if(scale>1) scale=1;

    pageHolder.setAttribute('style', style + ' ' + '-ms-transform-origin: left top; -webkit-transform-origin: left top; -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); background: #FFFFFF; position:absolute; top:0px; left:' + leftPos + 'px; -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + '); background-color:transparent;');
    //pageHolder.setAttribute('style', style + ' ' + '-ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + '); background-color:transparent;');
    //console.log(((jqnc("body").width() - jqnc("#Menu").width()) / 2) + "px");	        
}