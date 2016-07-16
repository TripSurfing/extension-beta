/*jshint esversion: 6*/
var switchState;
const getTripAdvisorState = sendResponse => {
    sendResponse(smartStorage.get('tripadvisorBtn'));
}
const setTripAdvisorState = state => {
    smartStorage.set('tripadvisorBtn', state);
}
const getSwitchState = sendResponse => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    switchState = smartStorage.get('switchState');
    if (switchState == null) {
        switchState = true;
        smartStorage.set('switchState', true);    
    }
    sendResponse(switchState);
}

const setSwitchState = (state, sendResponse) => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    smartStorage.set('switchState', state);

    if (state == false) {
        chrome.tabs.query({}, function(tabs) {
            var message = {hideAll: true};
            for (let i = 0, length = tabs.length; i < length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
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

var userId;
const getUserIdFromDb = () => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    userId = parseInt(smartStorage.get('userId'));
    getTripListFromDb();    
    // sendResponse(userId)
};

var tripList = [];
const getTripListFromDb = () => {
    tripList = [];
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    if (userId !== null) {
        $.ajax({
                url: tripSurfingUrl + 'api/getTripList',
                type: 'POST',
                dataType: 'json',
                data: { 'userId': userId },
            })
            .done(res => {
                tripList = res.list;
                smartStorage.set('tripList', res.list);
                getTripDetailFromDb();
            });
    }
};
var tripDetail = [];
const getTripDetailFromDb = () => {
    let numberOfTrip = tripList.length;
    tripDetail = [];
    let count = 0;
    
    for (let i = 0; i < numberOfTrip; i++) {
        let trip = tripList[i];
        $.ajax({
            url: tripSurfingUrl + 'api/renderTrip',
            type: 'POST',
            dataType: 'json',
            // async: false,
            data: {
                'userId': userId,
                'tripId': parseInt(trip.id),
            },
        }).done(res => {
            tripDetail[i] = res;
            count++;
        })
        .always(res => {
            if (count == numberOfTrip) {
                // sendResponse(tripDetail);
                smartStorage.set('tripDetail', tripDetail);
            }
        });
    }
};
const startGetData = getUserIdFromDb;
startGetData();
// (function poll() {
//    setTimeout(function() {
//        $.ajax({}).done(poll());
//    }, 3000);
// })();
// setInterval(startGetData, 3000);