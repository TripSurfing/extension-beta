(function() {

    // As we inject this  on Safari in /login we have to check if the e=4 is
    // in the url and prevent logout if it's not in the url
    //var url = document.URL;
    //if (isSafari() && url.indexOf("e=4") === -1) return;

    // Let the background know that the user successfully logged out
    chrome.runtime.sendMessage({action: "logout"}, function(response) {});
}());