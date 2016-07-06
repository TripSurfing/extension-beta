const requestToModel = (message, callback) => {
    chrome.runtime.sendMessage(message, response => callback(response));
}

var userId;
const getUserId = () => {
    let message = {
        getUserId: true
    }
    let callback = response => {
        userId = response;
    }
    requestToModel(message, callback);
}
getUserId();