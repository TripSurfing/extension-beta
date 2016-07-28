const ajaxRsPost = (link, ajaxData, sendResponse) => {
    request = $.ajax({
        url: TRIPSURFING_URL + link,
        type: 'POST',
        dataType: 'json',
        data: ajaxData,
        crossDomain: true
    })
    .done(res => sendResponse(res))
    .fail(res => {
        sendResponse(res);
    })
}
const getApi = {
    getTripById         : 'api/renderTrip',
    deleteItem          : 'api/extDelAction',
    addToFavorite       : 'api/extFavAction',
    removeFromFavorite  : 'api/extFavAction',
}