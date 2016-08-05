// use strict';

const renderTrip = (menuId, trip) => {
    renderPlaceTab(menuId, trip.places);
    renderLinkTab(menuId, trip.links);
    renderQuoteTab(menuId, trip.quotes);
    $('[tsrs-data="tipsy"]').tipsy({
        gravity: 'se',
        fade: true,
        delayIn: 200
    });
}

const address = item => {
	let address = $(item).data('location').split('-');
    return [+address[0], address[1], +address[2]];
}
const deleteItem = itemId => {
    // item.id = tsrs-{type}-{itemId}
    let info = itemId.split('-');
    console.log(itemId);
    if (info[1] = 'link__bag') return deleteQuotesByLink(itemId);
    let message = {
        rightSide: true,
        action: 'deleteItem',
        data: {
            type: info[0],
            itemId: info[2],
            // action: 'delete',
            userId: USER_ID
        }
    }
    let callback = response => {
        // if (response.type == 'success') {
        //     if (info[0] == 'place') {
        //         let leng = parseInt(document.getElementById('tsrs-quantity-place').innerHTML) - 1;
        //         if (leng < 2) document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' place';
        //         else document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' places';
        //     } else if (info[0] == 'link') {
        //         let leng = parseInt(document.getElementById('tsrs-quantity-link').innerHTML) - 1;
        //         if (leng < 2) document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' link';
        //         else document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' links';
        //     }

        //     [menuId, type, detailId] = address(item);
        //     TRIP_DETAIL[menuId][type].splice(detailId, 1);
        // }
        if (response.type != 'success') {
            console.log(response);
            let box = $(`#${itemId}`);
            box.children('div.box-info', 'div.box-image').removeClass('box-blur');
            box.children('div.box-confirm').remove();
            setTimeout(() => {box.fadeIn(300)}, 700);
            
        }
    }
    // console.log(TRIP_DETAIL);
    requestToModel(message, callback);
}
const deleteQuotesByLink = itemId => {
    let linkBag = $(`#${itemId}`);
    // console.log(linkBag);
    let url = linkBag.data('url');
    let quotes = QUOTE_BAG_LINK[url].quotes;
    let quoteIdList = Object.keys(quotes); 
    for (let i = 0, len = quoteIdList.length; i < len; i++) {
        deleteQuote(quoteIdList[i]);
    }
    // console.log(url);
    // console.log(QUOTE_BAG_LINK[url]);
}
const deleteQuote = quoteId => {
   // action: delete, itemId type: quote
   // id = tsrs-quoteId-{id}
   quoteId = quoteId.split('-')[2];
   let message = {
        rightSide: true,
        action: 'deleteItem',
        data: {
            type: 'quote',
            itemId: quoteId,
            // action: 'delete',
            userId: USER_ID
        }
    }
    let callback = response => {
        if (response.type != 'success') {
            setTimeout(() => {$('#${quoteId}').fadeIn(300)}, 700);
        }
    }
    requestToModel(message, callback);
} 

const addToFavorite = itemId => {
    let info = itemId.split('-');
    let message = {
        rightSide: true,
        action: 'addToFavorite',
        data: {
            type: info[0],
            itemId: info[1],
            action: 'add',
            userId: USER_ID
        }
    }
    let callback = response => {
        // if (response.type == 'success') {
        //     [menuId, type, detailId] = address(item);
        //     TRIP_DETAIL[menuId][type][detailId].favorites.push({
        //         user_id: USER_ID.toString()
        //     })
        // }
        if (response.type != 'success') {
            let heart = $(`#${itemId}`).find('i.tsrs-icon-heart');
            setTimeout(() => {
                heart.toggleClass("favorite-active favorite-not-active");
                heart.attr('title', 'Add to favorite');
            }, 500);
        }
    }
    requestToModel(message, callback);
}

const removeFromFavorite = itemId => {
    let info = itemId.split('-');
    let message = {
        rightSide: true,
        action: 'removeFromFavorite',
        data: {
            type: info[0],
            itemId: info[1],
            action: 'remove',
            userId: USER_ID
        }
    }
    let callback = response => {
        if (response.type != 'success') {
            let heart = $(`#${itemId}`).find('i.tsrs-icon-heart');
            setTimeout(() => {
                heart.toggleClass("favorite-active favorite-not-active");
                heart.attr('title', 'Remove from favorite');
            }, 500);
        }
    }
    
    requestToModel(message, callback);
}

const clearWindow = callback => {
    $("#tsrs-link-group, #tsrs-place-group").empty();
    callback();
}

const switchOff = () => {
    let message = {
        'request': 'setSwitchState',
        'state': false
    }
    let callback = response => {

    }
    requestToModel(message, callback);
}
const hideAll = () => {
    $('.tipsy').remove();
    $('#right-side, #tsrs-btn-tool-selector').remove();
}
const saveLink = () => {
    let message = {
        request: 'saveLink'
    }
    let callback = () => {}
    requestToModel(message, callback);
}
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        if (message.hideAll == true) {
            hideAll();
        }
        if (message.showAll == true) {
            SWITCH_STATE = true;
            startLoading();
        }
		if (message.refreshTripSurfing == true) {
			TRIP_LIST = message.tripList;
			TRIP_DETAIL = message.tripDetail;
            // clearWindow();
			renderTripList(true);
		}
});
