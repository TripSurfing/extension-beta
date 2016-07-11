/*jshint esversion: 6*/

var userId;
const getUserId = (sendResponse) => {
    if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
    userId = parseInt(smartStorage.get('userId'));    
    sendResponse(userId)
};

var tripList = [];
const getTripList = (sendResponse) => {
    tripList = [];
    if (userId !== null) {
        $.ajax({
                url: tripSurfingUrl + 'api/getTripList',
                type: 'POST',
                dataType: 'json',
                data: { 'userId': userId },
            })
            .always(res => { tripList = res.list;
                sendResponse(res); });
    }
};
var tripDetail = [];
const getTripDetail = (sendResponse) => {
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
        }).always(res => {
            if (count == numberOfTrip) {
                sendResponse(tripDetail);
            }
        });
    }
};
