// const tripSurfingUrl = 'http://wwww.tripsurfing.com/';
// const tripSurfingUrl = 'http://www.tripsurfing.co/';

const ajaxRsPost = (link, ajaxData, sendResponse) => {
    $.ajax({
        url: tripSurfingUrl + link,
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