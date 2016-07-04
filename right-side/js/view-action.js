const renderPlaceTab = placeList => {
    console.time('test');
    placeList.forEach(place => {
        let img_url = place.detail !== null ? place.detail.url : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
        let item =
            `<div class="box" id="place-${place.trip_place_id}">
                    <a class="box-image" href= ${place.url} target="_blank">
                        <div class="image" style="background-image: url(${img_url})"> </div>
                    </a>
                    
                    <div class="box-info">
                        <a href=${place.url} class="box-title" target="_blank" title="${place.name}">
                            <div class="tsrs-title-wrap">${place.name}</div>
                        </a>
                        
                        <div class="box-desc" title="${place.address}">${place.address}</div>
                        
                        <div class="place-bottom">
                            <div class="tsrs-rating">
                                <i class="tsrs-icon-star"></i> ${place.rate_avg}
                            </div>
                            <div class="delete-btn">
                                <i class="tsrs-icon-trash" title="Delete" tsrs-data="tipsy"></i>
                            </div>
                            <div class="favorite-btn">
                                <i class="tsrs-icon-heart favorite-not-active"  title="Add to favorite"   tsrs-data="tipsy"  id="place-${place.id}-favorite"></i>
                            </div>
                        </div>
                    </div>
            </div>`;
        $("#place-tab").append(item);
    });
    console.timeEnd('test');
}
const renderLinkTab = linkList => {
    linkList.forEach(link => {
        let img_url = (link.image !== null && link.image != "") ? link.image : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
        item =
            `<div class="box" id="link-${link.trip_link_id}">
                <a class="box-image" href=${link.url} target="_blank">
                    <div class="image" style="background-image: url(${img_url})"></div>
                </a>
                <div class="box-info">
                    <a href=${link.url} class="box-title"  target="_blank" title="${link.title}">
                        <div class="tsrs-title-wrap">${link.title}</div>
                    </a>
                    <div class="box-desc" title="${link.description}">${link.description}</div>
                    
                    <div class="link-bottom" style="background:url(${link.icon}) 0% 50% no-repeat">
                        <a class="link-canonical-url" target="_blank" href=http://${link.canonicalUrl}>
                            ${link.canonicalUrl}
                        </a>
                        <div class="delete-btn" >
                            <i class="tsrs-icon-trash" title="Delete" tsrs-data="tipsy"></i>\
                        </div>
                    </div>
                </div>
            </div>`;
        $("#link-tab").append(item);
    });
    // if (linkList.length > 3) $("#saved-links-id").append(nomore);
}
const announceError = message => {
    let error =  
        `<div class="error">
            <div class="error-content">${message}</div>
            <a href="http://tripsurfing.co/login" target="_blank">
                <button class="login-btn">Log In</button>
            </a>
        </div>`;
    $("#place-tab, #link-tab").append(error);
}

const renderTripList = tripList => {
    tripList.forEach(trip => {
        $('#tsrs-dropdown-content').append(`<a href="javascript:void(0)" id="${trip.id}">${trip.name}</a>`);
    });
}
const requestToModel = (message, callback) => {
    chrome.runtime.sendMessage(message, response => callback(response));
}
