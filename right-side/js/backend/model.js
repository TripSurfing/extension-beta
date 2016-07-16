chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
    	if (message.rightSide == true) {
    		ajaxRsPost(getApi[message.action], message.data, sendResponse);
        	return true;
    	} else {
            switch(message.request) {
                case 'getUserId':
		            return getUserId(sendResponse);  
                    break;
                case 'getTripList':
                    return getTripList(sendResponse);
                    break;
                case 'getTripDetail':
                    return getTripDetail(sendResponse);
                    break;
                case 'getSwitchState':
                    return getSwitchState(sendResponse);
                    break;
                case 'setSwitchState':
                    return setSwitchState(message.state, sendResponse);
                    break;
                case 'saveLink':
                    if(isLoggedIn()){
                      saveLink(sender.tab);
                    }else{
                      chrome.tabs.create({url: tripSurfingUrl+"signup?src=extension"});
                    }
                    break;
                case 'getTripAdvisorState':
                    return getTripAdvisorState(sendResponse);
                    break;
                case 'setTripAdvisorState':
                    return setTripAdvisorState(message.state);
                    break;
            }
        }
    });