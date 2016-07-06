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
const renderTrip = (tripId) => {
    if (isNaN(tripId)) {
        let defaultTrip = $(".default-trip")[0];
        tripId = +defaultTrip.id;
        $("#tsrs-trip-name").text(defaultTrip.text);
        // tripId = 27;
    }
    let message = {
        rightSide: true,
        action: "getTripById",
        data: { 
            "tripId": tripId,
            "userId": userId
        }
    }
    let callback = response => {
        switch (response.type) {
            case "success":
                renderPlaceTab(response.places);
                renderLinkTab(response.links);
                $('[tsrs-data="tipsy"]').tipsy({
                    gravity: 'se',
                    fade: true,
                    delayIn: 200
                });
                break;
            case "error":
                announceError(response.message);
                break;
        }
        console.log(response);
    };
    requestToModel(message, callback);
}

const deleteItem = item => {
    let info = item.id.split('-');
    let message = {
        rightSide: true,
        action: 'deleteItem',
        data: {
            type: info[0],
            itemId: info[1],
            action: 'delete',
        }
    }
    let callback = response => {
        console.log(response);
    }
    requestToModel(message, callback);
}

const addToFavorite = item => {
    let info = item.id.split('-');
    let message = {
        rightSide: true,
        action: 'addToFavorite',
        data: {
            type: info[0],
            itemId: info[1],
            action: 'add',
        }
    }
    let callback = response => {
        console.log(response);
    }
    requestToModel(message, callback);
}

const removeFromFavorite = item => {
    let info = item.id.split('-');
    let message = {
        rightSide: true,
        action: 'removeFromFavorite',
        data: {
            type: info[0],
            itemId: info[1],
            action: 'remove',
        }
    }
    let callback = response => {
        console.log(response);
    }
    requestToModel(message, callback);
}

const clearWindow = callback => {
    $("#link-tab, #place-tab").children("div").remove();
    callback();
}

const getTripList = () => {
    let message = {
        getTripList: true
    }
    let callback = response => {
        renderTripList(response.list);
    }
    requestToModel(message, callback);
}
$(() => {
    getUserId();
    getTripList();
});
