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
    return [address[0], address[1], address[2]];
}
const deleteItem = item => {
    let info = item.id.split('-');
    let message = {
        rightSide: true,
        action: 'deleteItem',
        data: {
            type: info[0],
            itemId: info[2],
            action: 'delete',
        }
    }
    let callback = response => {
        console.log(tripDetail);
    }
    // let add = address(item);
    [menuId, type, detailId] = address(item);
    tripDetail[menuId][type].splice(detailId, 1);
    console.log(tripDetail);
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
    [menuId, type, detailId] = address(item);
    tripDetail[menuId][type][detailId].favorites.push({
        user_id: userId.toString()
    })
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
    [menuId, type, detailId] = address(item);
    
    favorites = tripDetail[menuId][type][detailId].favorites;
    for (let i = 0, leng = favorites.length; i < leng; i++) {
        let user = favorites[i];
        if (user.user_id == userId) {
            favorites.splice(i, 1);
            break;
        }
    }

    // console.log(tripDetail[menuId][type][detailId].favorites)
    // console.log(favorites);
    requestToModel(message, callback);
}

const clearWindow = callback => {
    $("#link-tab, #place-tab").empty();
    callback();
}
// $(()=> {
//     setTimeout(() => {
//         clearWindow();
//         setInterval(startLoading, 5000);
//     }, 5000);
// })

// renderTripList();