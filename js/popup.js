// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//if(typeof tripSurfing.storage == 'undefined') tripSurfing.storage = new SmartStorage("tripSurfing.storage");
var background = chrome.extension.getBackgroundPage(); // background.clientId, background.extId
var tripSurfing = background.tripSurfing;

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function doSaving(link){
  //if(tripSurfing.status === 1){
    $.ajax({
      type: 'POST',
      url: tripSurfingUrl + 'api/saveLink',
      dataType: 'json',
      data: {userId: tripSurfing.user.id, link: link},
      cache: false,
      success: function (data) {
        //tripSurfing.client = data.client;
        tripSurfing.user = data.user;
        tripSurfing.trip = data.trip;
        tripSurfing.link = data.link;
        tripSurfing.note = data.note;
        tripSurfing.place = data.place;
        renderStatus(data.message);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        console.log(textStatus, errorThrown);
        renderStatus('Server disconnected!');
      }
    });  
  /*}else{
    chrome.browserAction.setIcon({
      path : "../img/icon.png"
    });
    renderStatus('Server offline!');
  }*/
  
}
 
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Saving link...');
    //$('#status').before('<div>Client Id: '+tripSurfing.storage.get('clientId')+'</div>');
    doSaving(url);    
  });
});
