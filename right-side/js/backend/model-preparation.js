const ajaxRsPost = (link, ajaxData, sendResponse) => {
    $.ajax({
        url: TRIPSURFING_API_URL + link,
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
    deleteItem          : 'api/action',
    addToFavorite       : 'api/favorite',
    removeFromFavorite  : 'api/favorite',
}