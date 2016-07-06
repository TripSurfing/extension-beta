// const render = (selector, items) => {
//     $(selector).append(items);
// }
const renderPlaceTab = placeList => {
    console.time('test');
    var item ='';
    for (place of placeList) {
        let img_url = place.images.length != 0 ? place.images[0].url : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
        item +=
            `<div class="box" id="place-${place.id}">
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
                                <i class="tsrs-icon-heart favorite-not-active"  title="Add to favorite" tsrs-data="tipsy"></i>
                            </div>
                        </div>
                    </div>
            </div>`;
        }
    document.getElementById('place-tab').innerHTML += item;
    console.timeEnd('test');
}
const renderLinkTab = linkList => {
    var item = '';
    for (link of linkList) {
        let img_url = (link.image !== null && link.image != "") ? link.image : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
        item +=
            `<div class="box" id="link-${link.id}">
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
    }
    document.getElementById('link-tab').innerHTML += item;
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
    $("#place-tab, #link-tab").html(error);
}

const renderTripList = (tripList) => {
    tripList.forEach(trip => {
        if (trip.is_default == 0)
            $('#tsrs-dropdown-content').append(`<a href="javascript:void(0)" id="${trip.id}">${trip.name}</a>`);
        else {
            $('#tsrs-dropdown-content').append(`<a href="javascript:void(0)" id="${trip.id}" class="default-trip">${trip.name}</a>`);
            $('#tsrs-trip-name').text(trip.name);
            renderTrip(trip.id);
        }

    });
}
const requestToModel = (message, callback) => {
    chrome.runtime.sendMessage(message, response => callback(response));
}