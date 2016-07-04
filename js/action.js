function saveLink(tab){
  var userId = smartStorage.get("userId");
  var doSaving = function(tab, userId){
    var link = tab.url;  
    
    link = trimChar(link, '#');
    
    var success = function (data) {
        chrome.tabs.executeScript({
          code: 'hideLoading(); showTSStatus("'+data.message+'")'
        });
      };
    var error = function(XMLHttpRequest, textStatus, errorThrown){
        chrome.tabs.executeScript({
          code: 'hideLoading(); showTSStatus("'+textStatus+'")'
        });
        console.log(textStatus, errorThrown);
      };
    var data = {userId: userId, link: link};
    
    ajaxPost('api/saveLink', data, success, error);
  }
  
  chrome.tabs.executeScript(tab.id, {
    code: 'showLoading()'
  });
  doSaving(tab, userId);  
}

function saveQuote(message, sendResponse){
  var userId = smartStorage.get("userId");
  var success = function (data) {
      sendResponse(data.message);
    };
  
  var error = function(XMLHttpRequest, textStatus, errorThrown){
      sendResponse(textStatus);
      console.error(XMLHttpRequest, textStatus, errorThrown);
    };
  
  var data = {userId: userId, data: message};
  ajaxPost('api/saveQuote', data, success, error);
}

function savePlace(message, sendResponse){
  var userId = smartStorage.get("userId");
  var success = function (data) {
      sendResponse(data.message);
    };
  
  var error = function(XMLHttpRequest, textStatus, errorThrown){
      sendResponse(textStatus);
      console.error(XMLHttpRequest, textStatus, errorThrown);
    };
  
  var data = {userId: userId, data: message};
  ajaxPost('api/savePlace', data, success, error);
}