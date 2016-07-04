var tripSurfingUrl = 'http://www.tripsurfing.co/';
//var tripSurfingUrl = 'http://www.tripsurfing.loc/';

function ajaxPost(url, data, success, error){
  error = error || function(XMLHttpRequest, textStatus, errorThrown){
    console.error(XMLHttpRequest, textStatus, errorThrown);
  };
  $.ajax({
    type: 'POST',
    url: tripSurfingUrl + url,
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: error
  });
}