/*jshint esversion: 6*/
if (typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
const userId = parseInt(smartStorage.get('userId'));
const getUserId = (sendResponse) => sendResponse(userId);

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
    tripDetail = [];
    for (trip of tripList) {
        $.ajax({
            url: tripSurfingUrl + 'api/renderTrip',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                'userId': userId,
                'tripId': parseInt(trip.id),
            },
        }).done(res => {
            tripDetail.push(res);
        });

    }
    sendResponse(tripDetail);
};
