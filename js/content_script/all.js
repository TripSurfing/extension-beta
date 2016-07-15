  $('body').append('<div id="tripsurfing-tool" style="display: none;"><div class="tripsurfing-arrow-up"></div><a class="tripsurfing-save-quote" href="#" label="Save this as a Quote">Save Quote</a></div>');

  $('body').append('<div id="tripsurfing-status">\
  <div class="ts-content">\
    <a href="'+tripSurfingUrl+'queue" target="_blank" title="Go to Queue"><div class="ts-logo"><img src="'+ chrome.extension.getURL("right-side/image/icon38.png") + '" ></div></a>\
    <div class="ts-message">Page saved!</div>\
  </div>\
  <div class="ts-close" title="Close">&times;</div>\
  </div>');

$('#tripsurfing-status .ts-close').click(function(){
  hideTSStatus();
});

var textHighlighted = function(e){
  //if (e.which === 1) {
    var selectedText = getSelectionText();
    
    if(selectedText.text.length > 2 && !$(':focus').is('input') && !$(':focus').is('textarea') && !$(':focus').is('button')){
      //$('#tripsurfing-tool').css("left", e.pageX - 5);
      //$('#tripsurfing-tool').css("top", e.pageY + 15);
      markSelection();
      //$('.tripsurfing-tool').css("padding", "0 5px");
      //$('.tripsurfing-tool').css("border", "1px solid orange");
      //$('.tripsurfing-tool').css("z-index", "999999");
      //$('.tripsurfing-tool').css("background", "white");
      $('#tripsurfing-tool').show();
      
    }else{
      $('#tripsurfing-tool').hide();
    }
  //}
}

$(document).on('mouseup', textHighlighted);
$(document).on('keyup', textHighlighted);

$('#tripsurfing-tool').click(function(){
  var selectedText = getSelectionText();
  if(selectedText.text.length > 3 && !$(':focus').is('input') && !$(':focus').is('textarea') && !$(':focus').is('button')){
    var data = {fromUrl: trimChar(location.href, '#'), quote: selectedText.text, type: "quote"};
    $('#tripsurfing-tool').hide();
    clearSelectionText();
    showLoading();
    chrome.runtime.sendMessage(data, function(response){hideLoading(); showTSStatus(response)});    
  }
  return false;
});

$(document).on('mousedown', function (e) {
  var sel = window.getSelection();
	if(!sel.rangeCount) return;
	var range = sel.getRangeAt(0);
	// nothing selected : don't do anything
	if(range.collapsed) return;
	// Firefox allows us to get the real node we clicked on
	var result = isTargetInRange(range, e.explicitOriginalTarget, e.target);
  if (e.which === 1 && result) {
    // Clicked outside the tripsurfing tool, hide it  
    if ($(e.target).closest('#tripsurfing-tool').length === 0) {
      clearSelectionText();
      $('#tripsurfing-tool').hide();
    }
  }
});

//http://stackoverflow.com/questions/31720096/detect-right-mouse-click-outside-of-the-user-selection-highlight
function getNextNode(node) {
    if (node.firstChild)
        return node.firstChild;

    while (node) {
        if (node.nextSibling) return node.nextSibling;
        node = node.parentNode;
    }
}

function isTargetInRange(range, nodeTarget, elementTarget) {
    var start = range.startContainer.childNodes[range.startOffset] || range.startContainer;
    var end = range.endContainer.childNodes[range.endOffset] || range.endContainer;
    var commonAncestor = range.commonAncestorContainer;
    var nodes = [];
    var node;
    var result=false;
    for (node = start.parentNode; node; node = node.parentNode)
    {
    	// our target is an element
    	if(!nodeTarget && elementTarget === node ){
    		result=true;
    		break;
    		}
        nodes.push(node);
        if (node == commonAncestor)
            break;
    }
    nodes.reverse();

    // walk children and siblings from start until end is found
    for (node = start; node; node = getNextNode(node))
    {
		// our target can be a textNode
		if((nodeTarget && nodeTarget === node) || (!nodeTarget && elementTarget === node)){
			result=true;
			break;
			}
        if (node == end)
            break;
    }
    return result;
};

// http://stackoverflow.com/questions/1589721/how-can-i-position-an-element-next-to-user-text-selection/1589912#1589912
var markSelection = (function() {
  var markerTextChar = "\ufeff";

  var markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

  var selectionEl;

  return function() {
    var sel, range;

    if (window.getSelection) {
        sel = window.getSelection();

        if (sel.getRangeAt) {
            range = sel.getRangeAt(0).cloneRange();
        } else {
            // Older WebKit doesn't have getRangeAt
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the
            // document)
            if (range.collapsed !== sel.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }
        }

        range.collapse(false);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        markerEl = document.createElement("span");
        markerEl.id = markerId;
        markerEl.style.display = "inline-block";
        markerEl.appendChild( document.createTextNode(markerTextChar) );
        range.insertNode(markerEl);
    }

    if (markerEl) {

        // Find markerEl position http://www.quirksmode.org/js/findpos.html
      

      // Move the button into place.
      // Substitute your jQuery stuff in here
      $('#tripsurfing-tool').css("left", $(markerEl).offset().left - 22);
      $('#tripsurfing-tool').css("top", $(markerEl).offset().top + $(markerEl).height() + 8);
      
      markerEl.parentNode.removeChild(markerEl);
    }
  };
})();

function getSelectionText() {
  var text = "", bound = "";
  if (window.getSelection && window.getSelection().baseNode && window.getSelection().baseNode.parentElement.tagname != 'INPUT' && window.getSelection().baseNode.parentElement.tagname != 'TEXTAREA') {
    text = window.getSelection().toString();
    bound = window.getSelection().getRangeAt(0).getBoundingClientRect();
  }
  
  return {text: text, bound: bound};
}

function clearSelectionText() {
  if (window.getSelection) {
    if (window.getSelection().empty) {  // Chrome
      window.getSelection().empty();
    }
  }
}

var timer;

function showTSStatus(message){
  clearInterval(timer);
  $('#tripsurfing-status .ts-message').html(message);  
  $('#tripsurfing-status').show();
  //$('.tripsurfing-status').html(message);
  //$('.tripsurfing-status').show();
  //$('body').css('padding-top', '37px');
  timer = setInterval( hideTSStatus, 8000);
}

function hideTSStatus() {
  $('#tripsurfing-status').hide();
  //$('.tripsurfing-status').slideUp();
  //$('body').css('padding-top', '0');
  clearInterval(timer);
};

function trimChar(string, charToRemove) {
    while(string.charAt(0)==charToRemove) {
        string = string.substring(1);
    }

    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1);
    }

    return string;
}

function showLoading() {
  showTSStatus("Saving...");
  $('#tripsurfing-status .ts-logo').html("<img width='40' src='"+tripSurfingUrl+"static/img/loading.gif"+"'>");
}

function hideLoading() {
  $('#tripsurfing-status .ts-logo').html('<img src="'+tripSurfingUrl+'static/img/icon48.png" >');
}