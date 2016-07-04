//$('#tripsurfing-load').click(function(){
/*
if(!checkCookie('userId')){
  var data = {fromUrl: location.href, user: 0, type: "userdata"};
  chrome.runtime.sendMessage(data, function(response){
    //var dashboardData = renderDashboardData(response);
    //console.log(response.user.id);
    //if(typeof tripSurfing.storage == 'undefined') tripSurfing.storage = new SmartStorage("tripSurfing");
    
    setCookie('userId', response.user.id, 365);
    if($('body').is($('#page-queue')) || $('body').is($('#page-queue-l'))){
      var url = location.href;
      var queueId = url.split("?")[0].split("#")[0].split("/").pop();
      
      if($('body').is($('#page-queue'))) var queueId = 0;
      
      $.ajax({
        type: 'POST',
        url: tripSurfingUrl + 'api/renderQueue',
        dataType: 'json',
        data: {userId: response.user.id, queueId: queueId},
        cache: false,
        success: function (data) {
          if(data.type == "success"){            
            renderQueueData(data);
          }else{
            console.error(data.message);
          }      
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
          console.error(XMLHttpRequest, textStatus, errorThrown);
        }
      });
    }
  });
}else{
  var userId = getCookie('userId');
  if($('body').is($('#page-queue')) || $('body').is($('#page-queue-l'))){
    var url = location.href;
    var queueId = url.split("?")[0].split("#")[0].split("/").pop();
    
    if($('body').is($('#page-queue'))) var queueId = 0;
      
    $.ajax({
      type: 'POST',
      url: tripSurfingUrl + 'api/renderQueue',
      dataType: 'json',
      data: {userId: userId, queueId: queueId},
      cache: false,
      success: function (data) {
        if(data.type == "success"){
          renderQueueData(data);
        }else{
          console.error(data.message);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        console.error(XMLHttpRequest, textStatus, errorThrown);
      }
    });
  }
}

//});
*/


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie(cname) {
    var item = getCookie(cname);
    if (item != "") {
      return true;
    } else {
      return false;
    }
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}