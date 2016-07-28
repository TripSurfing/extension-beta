var parentElement1 = $('#HEADING_GROUP .heading_ratings');
var parentElement2 = $('.attraction_list .rating');

chrome.runtime.sendMessage({request: 'getTripAdvisorState'}, function(res) {
  if (res == true) {
    parentElement1.append('<div class="heading_rating separator"><a id="tripsurfing-save" href="#" title="Save Place"><img width="24px" src="'+ tripSurfingUrl +'static/img/icon48.png" alt="TripSurfing"/></a></div>');
    parentElement2.append('<span><a class="tripsurfing-list-save" href="#" title="Save Place"><img width="16px" src="'+ tripSurfingUrl +'static/img/icon16.png" alt="TripSurfing"/></a></span>')
  }
});

$('body').on('click', '#tripsurfing-save',function(){
  var data = {fromUrl: trimChar(location.href, '#'), placeUrl: location.href, source: "tripadvisor", type: "place"};  
  showLoading();
  chrome.runtime.sendMessage(data, function(response){hideLoading(); showTSStatus(response)});
  return false;
});

$('body').on('click', '.tripsurfing-list-save', function(){
  var placeUrl = location.origin + $(this).parents('.entry').find('.property_title a').attr("href");
  var data = {fromUrl: trimChar(location.href, '#'), placeUrl: placeUrl, source: "tripadvisor", type: "place"};
  showLoading();
  chrome.runtime.sendMessage(data, function(response){hideLoading(); showTSStatus(response)});
  return false;
});

function trimChar(string, charToRemove) {
    while(string.charAt(0)==charToRemove) {
        string = string.substring(1);
    }

    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1);
    }

    return string;
}