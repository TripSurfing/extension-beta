chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
    	if (message.rightSide == true) {
    		ajaxRsPost(getApi[message.action], message.data, sendResponse);
        	return true;
    	}
    	if (message.getUserId == true) {
    		return getUserId(sendResponse);
    	}
    	if (message.getTripList == true) {
    		return getTripList(sendResponse);
    	}
        if (message.getTripDetail == true) {
            return getTripDetail(sendResponse);
        }
    });