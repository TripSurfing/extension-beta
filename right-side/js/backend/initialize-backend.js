/*jshint esversion: 6*/
const TRIPSURFING_API_URL = 'http://api.tripsurfing.co/';
const TRIPSURFING_URL = 'http://www.tripsurfing.co/';

var SWITCH_STATE;
const getTripAdvisorState = sendResponse => {
    sendResponse(smartStorage.get('tripadvisorBtn'));
}
const setTripAdvisorState = state => {
    smartStorage.set('tripadvisorBtn', state);
}
const getSwitchState = sendResponse => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    SWITCH_STATE = smartStorage.get('switchState');
    if (SWITCH_STATE == null) {
        SWITCH_STATE = true;
        smartStorage.set('switchState', true);
    }
    sendResponse(SWITCH_STATE);
}

const setSwitchState = (state, sendResponse) => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    smartStorage.set('switchState', state);

    if (state == false) {
        chrome.tabs.query({}, function(tabs) {
            var message = { hideAll: true };
            for (let i = 0, length = tabs.length; i < length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
        });
        smartStorage.set('lastTime', LAST_TIME);
        // pollAjax.abort();
        // pollAjax = null;
        chrome.browserAction.setIcon({
            path: chrome.extension.getURL('img/icon-black.png')
        });
    }
    sendResponse({});
}

const getUserId = sendResponse => {
    sendResponse(parseInt(smartStorage.get('userId')));
}
const getTripList = sendResponse => {
    sendResponse(smartStorage.get('tripList'));
}
const getTripDetail = sendResponse => {
    sendResponse(smartStorage.get('tripDetail'));
}

var USER_ID;
const getUserIdFromDb = (isPoll = false) => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    USER_ID = parseInt(smartStorage.get('userId'));
    getTripListFromDb(isPoll);
    // sendResponse(USER_ID)
};

var TRIP_LIST = [];
const getTripListFromDb = (isPoll = false) => {
    TRIP_LIST = [];
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    if (USER_ID !== null) {
        $.ajax({
                url: TRIPSURFING_URL + 'api/getTripList',
                type: 'POST',
                dataType: 'json',
                data: { 'userId': USER_ID },
            })
            .done(res => {
                TRIP_LIST = res.list;
                smartStorage.set('tripList', res.list);
                getTripDetailFromDb(isPoll);
            });
    }
};
var TRIP_DETAIL = [];
var LAST_TIME;
const getTripDetailFromDb = (isPoll = false) => {

    let numberOfTrip = TRIP_LIST.length;
    TRIP_DETAIL = [];
    let count = 0;
    LAST_TIME = Math.round(Date.now() / 1000);

    for (let i = 0; i < numberOfTrip; i++) {
        let trip = TRIP_LIST[i];
        $.ajax({
                url: TRIPSURFING_URL + 'api/renderTrip',
                type: 'POST',
                dataType: 'json',
                // async: false,
                data: {
                    'userId': USER_ID,
                    'tripId': parseInt(trip.id),
                },
            }).done(res => {
                TRIP_DETAIL[i] = res;
                count++;
            })
            .always(res => {
                if (count == numberOfTrip) {
                    // sendResponse(TRIP_DETAIL);
                    smartStorage.set('tripDetail', TRIP_DETAIL);
                    if (isPoll == true) poll(LAST_TIME);
                    chrome.tabs.query({}, function(tabs) {
                        var message = {
                            refreshTripSurfing: true,
                            tripList: TRIP_LIST,
                            tripDetail: TRIP_DETAIL
                        };
                        for (let i = 0, length = tabs.length; i < length; i++) {
                            chrome.tabs.sendMessage(tabs[i].id, message);
                        }
                    });

                }
            });
    }
};
const startGetData = getUserIdFromDb;
if (isLoggedIn()) {
    startGetData(true);
    // startPoll();
}
// startGetData();
// (function poll() {
//    setTimeout(function() {
//        $.ajax({}).done(poll());
//    }, 3000);
// })();
// setInterval(startGetData, 3000);
