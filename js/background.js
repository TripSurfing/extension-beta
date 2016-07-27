// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    chrome.tabs.create({url: tripSurfingUrl+"#howtouse"});
  }
});
/*
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if (request) {
            if (request.message) {
              sendResponse({installed: true});
            }
        }
        return true;
    });
*/
var tripSurfing = {status: 0};

// Initiate the variables if smartStorage, clientId are undefined.
if(typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
smartStorage.set('tripadvisorBtn', true);
if(!smartStorage.get('clientId')){
  smartStorage.set('clientId', guid());
}

// Get data for this clientId in our database
  var clientId = smartStorage.get('clientId'), extId = chrome.runtime.id;

var isLoggedIn = function() {
  return !(typeof smartStorage == "undefined" || !smartStorage.get("userId"));
}

chrome.browserAction.onClicked.addListener(function (tab){
  let state = smartStorage.get('switchState');
  if (state == true) {
    var currentPage = tab.url;
    tripSurfing.currentAction = 'saveLink';
    tripSurfing.currentTab = tab;
    
    if(currentPage.indexOf('http://') === -1 && currentPage.indexOf('https://') === -1) {
      chrome.tabs.update(tab.id, {url: tripSurfingUrl});
      return;
    }
    
    if(isLoggedIn()){
      saveLink(tab);
    }else{
      tripSurfing.currentAction = '';
      chrome.tabs.create({url: tripSurfingUrl+"signup?src=extension"});
      // or window.open
    }    
  }
  else {
    smartStorage.set('switchState', true);
    // startGetData();
    chrome.tabs.query({}, function(tabs) {
        var message = {showAll: true};
        for (let i = 0, length = tabs.length; i < length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, message);
        }
    });
  }
});

// Listen to the message from content_script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
   
  // From tripadvisor.js
  if(message.type == "place"){
    tripSurfing.currentMessage = message;  
    tripSurfing.currentResponse = sendResponse;
    tripSurfing.currentTab = sender.tab;
    tripSurfing.currentAction = 'savePlace';
    if(isLoggedIn()){
      savePlace(message, sendResponse);
    }else{
      chrome.tabs.create({url: tripSurfingUrl+"signup?src=extension"});
    }
  }
  
  // From all.js
  if(message.type == "quote"){
    tripSurfing.currentMessage = message;  
    tripSurfing.currentResponse = sendResponse;
    tripSurfing.currentTab = sender.tab;
    tripSurfing.currentAction = 'saveQuote';
    if(isLoggedIn()){
      saveQuote(message, sendResponse);
    }else{
      chrome.tabs.create({url: tripSurfingUrl+"signup?src=extension"});
    }    
  }
  
  if(message.type == "userdata"){ 
    sendResponse(tripSurfing);
  }
  
  //From login.js
  if(message.action == "loggedIn"){    
    smartStorage.set("userId", message.userId);
    sendResponse({});
    chrome.tabs.query({},function(tabs) {
      // var message = {
      //   showAll: true
      // };
      startGetData();
      startPoll();
      for (let i = 0, length = tabs.length; i < length; i++) {
          let tab = tabs[i];
          var url = tab.url;
          var windowId = tab.windowId;
          if (url.indexOf("extension_login") !== -1) {
              chrome.tabs.remove(tab.id, function() {});
          }
      }
    });
    console.log(tripSurfing.currentTab);

    chrome.tabs.query({}, function(tabs) {
        var message = {showAll: true};
        for (let i = 0, length = tabs.length; i < length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, message);
        }
    });
    chrome.tabs.update(tripSurfing.currentTab.id, {active: true});
    if(tripSurfing.currentAction == "saveLink"){
      saveLink(tripSurfing.currentTab);
    }else if(tripSurfing.currentAction == "saveQuote"){
      saveQuote(tripSurfing.currentMessage, tripSurfing.currentResponse);
    }else{
      savePlace(tripSurfing.currentMessage, tripSurfing.currentResponse);
    }
    
  }else if (message.action === "logout") {
    // Logout the extension    
    smartStorage.set("userId", "");

    sendResponse({});
    return false;
  }
  
  return true;
  /*}else{
    chrome.browserAction.setIcon({
      path : "../img/icon.png"
    });
    showTSStatus('Server offline!');
  }*/
});

function guid() {

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

// http://stackoverflow.com/questions/26156292/jquery-trim-specific-character-from-string
function trimChar(string, charToRemove) {
    while(string.charAt(0)==charToRemove) {
        string = string.substring(1);
    }

    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1);
    }

    return string;
}