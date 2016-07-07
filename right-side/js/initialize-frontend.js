const requestToModel = (message, callback) => {
    chrome.runtime.sendMessage(message, response => callback(response));
}

var userId;
var tripList = [];
var tripDetail = [];
var favorites = [];

const getUserId = () => {
    let message = {
        getUserId: true
    }
    let callback = response => {
        userId = response;
        getTripList();
    }
    requestToModel(message, callback);
}

const getTripList = () => {
    let message = {
        getTripList: true
    }
    let callback = response => {
        tripList = response.list;
        getTripDetail();
    }
    requestToModel(message, callback);
}

const getTripDetail = () => {
	let message = {
		getTripDetail: true
	}
	let callback = response => {
		tripDetail = response;
		renderTripList();
	}
	requestToModel(message, callback);
}
// const getFavorites = () => {

// }
// Start Extension
// const startLoading = $.Deferred();
const startLoading = getUserId;

