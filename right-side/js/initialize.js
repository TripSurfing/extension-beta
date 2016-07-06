if(typeof smartStorage == 'undefined') smartStorage = new SmartStorage("tripSurfing");
const userId = parseInt(smartStorage.get('userId'));

const getUserId = (sendResponse) => sendResponse(userId);

const getTripList = (sendResponse) => {	
    if (userId !== null) {
        $.ajax({
        	url: tripSurfingUrl + 'api/getTripList',
        	type: 'POST',
        	dataType: 'json',
        	data: {'userId': userId},
        })
        .done(res => sendResponse(res))
        .fail(res => sendResponse(res));
    } 
}