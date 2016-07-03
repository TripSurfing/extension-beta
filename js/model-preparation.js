// const tripSurfingUrl = 'http://wwww.tripsurfing.com/';
const tripSurfingUrl = 'http://www.tripsurfing.co/';

const ajaxPost = (link, ajaxData, sendResponse) => {
    $.ajax({
        url: tripSurfingUrl + link,
        type: 'POST',
        dataType: 'json',
        data: ajaxData,
        crossDomain: true
    })
    .done(res => sendResponse(res))
    .error(res => (XMLHttpRequest, textStatus, errorThrown) => {
        sendResponse(textStatus);
        console.error(XMLHttpRequest, textStatus, errorThrown);
    })
}
const getApi = {
    getTripById         : 'api/renderTrip',
    deleteItem          : 'api/action',
    addToFavorite       : 'api/favorite',
    removeFromFavorite  : 'api/favorite',
    getTripList         : 'api/getTripList',
}

