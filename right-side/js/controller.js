// use strict';

const renderTrip = (menuId, trip) => {
    renderPlaceTab(menuId, trip.places);
    renderLinkTab(menuId, trip.links);
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
const deleteItem = item => {
    let info = item.id.split('-');
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
        if (response.type == 'success') {
            if (info[0] == 'place') {
                let leng = parseInt(document.getElementById('tsrs-quantity-place').innerHTML) - 1;
                if (leng < 2) document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' place';
                else document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' places';
            } else if (info[0] == 'link') {
                let leng = parseInt(document.getElementById('tsrs-quantity-link').innerHTML) - 1;
                if (leng < 2) document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' link';
                else document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' links';
            }

            [menuId, type, detailId] = address(item);
            TRIP_DETAIL[menuId][type].splice(detailId, 1);
        } else {
            console.log(response);
            let box = $(item);
            box.children('div.box-info', 'div.box-image').removeClass('box-blur');
            box.children('div.box-confirm').remove();
            setTimeout(() => {$(item).fadeIn(300)}, 700);
            
        }
    }
    // console.log(TRIP_DETAIL);
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
            userId: USER_ID
        }
    }
    let callback = response => {
        if (response.type == 'success') {
            [menuId, type, detailId] = address(item);
            TRIP_DETAIL[menuId][type][detailId].favorites.push({
                user_id: USER_ID.toString()
            })
        } else {
            let heart = $(item).find('i.tsrs-icon-heart');
            setTimeout(() => {
                heart.toggleClass("favorite-active favorite-not-active");
                heart.attr('title', 'Add to favorite');
            }, 500);
        }
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
            userId: USER_ID
        }
    }
    let callback = response => {
        if (response.type == 'success') {
            [menuId, type, detailId] = address(item);    
            FAVORITES = TRIP_DETAIL[menuId][type][detailId].favorites;
            for (let i = 0, leng = FAVORITES.length; i < leng; i++) {
                let user = FAVORITES[i];
                if (user.user_id == USER_ID) {
                    FAVORITES.splice(i, 1);
                    break;
                }
            }
        } else {
            let heart = $(item).find('i.tsrs-icon-heart');
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
			renderTripList();
		}
});
