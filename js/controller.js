const renderTrip = tripId => {
    if (isNaN(tripId)) {
        let defaultTrip = $(".default-trip")[0];
        tripId = +defaultTrip.id;
        $("#tsrs-trip-name").text(defaultTrip.text);
    }
    let message = {
        action:   "getTripById",
        data: {"tripId" : tripId}
    }
    let callback = response => {
        switch(response.type) {
            case "success":
                renderPlaceTab(response.place);
                renderLinkTab(response.link);
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

const getTripList = userId => {
    let message = {
        action: 'getTripList',
        data: {
            'userId': userId,
        }
    }
    let callback = response => {
        switch (response.type) {
            case 'success':
                renderTripList(response.list);
                break;
            case 'error':
                break;
        }
    }
    requestToModel(message, callback);
}
$(() => {
    getTripList(23);
});
