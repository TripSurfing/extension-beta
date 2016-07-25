const requestToModel = (message, callback) => {
    chrome.runtime.sendMessage(message, response => callback(response));
}

var userId;
var tripList = [];
var tripDetail = [];
var favorites = [];
var switchState;

const getUserId = () => {
    let message = {
        request: 'getUserId'
    }
    let callback = response => {
        userId = response;
        if (userId != null)
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
        tripList = response;
        getTripDetail();
    }
    requestToModel(message, callback);
} 
const getTripDetail = () => {
	let message = {
		request: 'getTripDetail'
	}
	let callback = response => {
		tripDetail = response;
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
        switchState = state;
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

