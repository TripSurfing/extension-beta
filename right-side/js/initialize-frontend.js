const requestToModel = (message, callback) => {
    chrome.runtime.sendMessage(message, response => callback(response));
}

var USER_ID;
var TRIP_LIST = [];
var TRIP_DETAIL = [];
var FAVORITES = [];
var SWITCH_STATE;
var CURRENT_TRIP_ID = null;

const getUserId = () => {
    let message = {
        request: 'getUserId'
    }
    let callback = response => {
        USER_ID = response;
        if (USER_ID != null)
            getTripList();
        else announceError('You have to login or signup first');
    }
    requestToModel(message, callback);
} 

const getTripList = () => {
    let message = {
        request: 'getTripList'
    }
    let callback = response => {
        TRIP_LIST = response;
        getTripDetail();
    }
    requestToModel(message, callback);
} 
const getTripDetail = () => {
	let message = {
		request: 'getTripDetail'
	}
	let callback = response => {
		TRIP_DETAIL = response;
        addExt();
        renderTripList();
    }
    requestToModel(message, callback);
}

const checkState = () => {
    let message = {
        request: 'getSwitchState'
    }
    let callback = state => {
        SWITCH_STATE = state;
        if (state == true) {
            getUserId();
        } else {
            return
        }
    }
    requestToModel(message, callback);
}
// const getFavorites = () => {

// }
// Start Extension
// const startLoading = $.Deferred();
const startLoading = checkState;

