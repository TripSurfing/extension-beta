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

const clearWindow = callback => {
    $("#link-tab, #place-tab").children("div").remove();
    callback();
}
$(() => {
    renderTrip();
});
