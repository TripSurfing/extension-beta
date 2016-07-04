(function() {
  if(checkCookie('userId')){
    var userId = getCookie('userId');    

    var message = {
      action: "loggedIn",
      userId: userId
    };

    // Wait a second and send the login userId
    setTimeout(function() {
        // Let the background know that the user successfully logged in
        chrome.runtime.sendMessage(message, function(response) {});
    }, 1500);
  }
}());
