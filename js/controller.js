const renderPlaceTab = placeList => {
    console.time('test');
    placeList.forEach(place => {
        let img_url = place.detail === null ? "http://www.tripsurfing.co/static/img/noimg.jpg" : place.detail.url; 
        let item =
            `<div class="box">
                    <a class="box-image" href= ${place.url} target="_blank">
                        <div class="image" style="background-image: url(${img_url})"> </div>
                    </a>
                    
                    <div class="box-info">
                        <a href=${place.url} class="box-title" target="_blank" title="${place.name}">
                            <div class="tsrs-title-wrap">${place.name}</div>
                        </a>
                        
                        <div class="box-desc" title="${place.address}">${place.address}</div>
                        
                        <div class="place-bottom" id="place-${place.id}">
                            <div class="tsrs-rating">
                                <i class="tsrs-icon-star"></i> 4.5
                            </div>
                            <div class="delete-btn">
                                <i class="tsrs-icon-trash" title="Delete" tsrs-data="tipsy"></i>
                            </div>
                            <div class="favorite-btn">
                                <i class="tsrs-icon-heart favorite-not-active"  title="Add to favorite"   tsrs-data="tipsy"></i>
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
        item =
            `<div class="box">
                <a class="box-image" href=${link.url} target="_blank">
                    <div class="image" style="background-image: url(${link.image})"></div>
                </a>
                <div class="box-info">
                    <a href=${link.url} class="box-title"  target="_blank" title="${link.title}">
                        <div class="tsrs-title-wrap">${link.title}</div>
                    </a>
                    <div class="box-desc" title="${link.description}">${link.description}</div>
                    
                    <div id="link-${link.id}" class="link-bottom" style="background:url(${link.icon}) 0% 50% no-repeat">
                        <a class="link-canonical-url" target="_blank" href=http://${link.canonicalUrl}>
                            ${link.canonicalUrl}
                        </a>
                        <div class="delete-btn" >
                            <i class="icon-entyp tsrs-icon-trash" title="Delete" tsrs-data="tipsy"></i>\
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

const renderTrip = tripId => {
    if (isNaN(tripId)) {
        let defaultTrip = $(".default-trip")[0];
        tripId = +defaultTrip.id;
        $("#tsrs-trip-name").text(defaultTrip.text);
    }
    let message = {
        action:   "getTripById",
        data: {"tripId" : tripId}
    }
    chrome.runtime.sendMessage(message, function(response){
        switch(response.type) {
            case "success":
                renderPlaceTab(response.place);
                renderLinkTab(response.link);
                $('[tsrs-data="tipsy"]').tipsy({
                    gravity: 'se',
                    fade: true,
                    delayIn: 200
                });
                break;
            case "error":
                announceError(response.message);
                break;
        }
        console.log(response);
    });

}
const clearWindow = callback => {
    $("#link-tab, #place-tab").children("div").remove();
    callback();
}
$(() => {
    renderTrip();
});
