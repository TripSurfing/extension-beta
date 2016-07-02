chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        ajaxPost(getApi[message.action], message.data, sendResponse);
        return true;
    });