// const render = (selector, items) => {
//     $(selector).append(items);
// }
const favoriteState = favorites => {
    if (favorites.length == 0) return ['favorite-not-active', 'Add to favorite'];
    else {
        for(user of favorites) {
            if (user.user_id == userId) return ['favorite-active', 'Remove from favorite'];
        }
        return ['favorite-not-active', 'Add to favorite'];
    }
}
const renderPlaceTab = (menuId, placeList) => {
    console.time('test');
    let item ='';
    let leng = placeList.length;

    if (leng < 2) document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' place';
    else document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' places';

    if (leng == 0) announceEmpty('tsrs-place-group');
    else {
        for (let i = 0, leng = placeList.length; i < leng; i++) {
            let place = placeList[i];
            let img_url = place.images.length != 0 ? place.images[0].url : "http://www.tripsurfing.co/static/img/noimg.jpg";
            let favoriteInfo = favoriteState(place.favorites);
            // place_id = favorite, place.id = delete
            item +=
                `<div class="box" id="place-${place.place_id}-${place.id}" data-location="${menuId}-places-${i}">
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
                                    <i class="tsrs-icon-heart ${favoriteInfo[0]}"  title="${favoriteInfo[1]}" tsrs-data="tipsy"></i>
                                </div>
                            </div>
                        </div>
                </div>`;
            }
        document.getElementById('tsrs-place-group').innerHTML = item;
    }
    console.timeEnd('test');
}
const renderLinkTab = (menuId, linkList) => {
    let item = '';
    let leng = linkList.length;
    if (leng < 2) document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' link';
    else document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' links';
    if (leng == 0) announceEmpty('tsrs-link-group');
    else {
        for (let i = 0; i < leng; i++) {
            let link = linkList[i];
            let img_url = (link.image !== null && link.image != "") ? link.image : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
            let favoriteInfo = favoriteState(link.favorites);
            item +=
                `<div class="box" id="link-${link.link_id}-${link.id}" data-location="${menuId}-links-${i}">
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
                                <i class="tsrs-icon-trash" title="Delete" tsrs-data="tipsy"></i>
                            </div>
                            <div class="favorite-btn">
                                <i class="tsrs-icon-heart ${favoriteInfo[0]}" tsrs-data="tipsy" title="${favoriteInfo[1]}"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
        document.getElementById('tsrs-link-group').innerHTML = item;
    }
    // if (linkList.length > 3) $("#saved-links-id").append(nomore);
}
const announceError = message => {
    let error =  
        `<div class="tsrs-error">
            <div class="error-content">${message}</div>
            <a href="http://tripsurfing.co/login?src=extension" target="_blank">
                <button class="login-btn">Log In</button>
            </a>
        </div>`;
    document.querySelector("#place-tab, #link-tab").innerHTML += error;
}
const announceEmpty = nameTab => {
    let emptyAnnouncement =
        `<div class="tsrs-empty">
            <div>Oop! You have not added any item yet.</div>
        </div>`
    document.getElementById(nameTab).innerHTML += emptyAnnouncement;
}
const renderTripList = () => {
    let list = '';
    let  len = tripList.length;
    if (len == 0 || len == undefined || len == null) {
        document.getElementById('tsrs-trip-name').innerHTML = 'No trips :(';
    } else {
        for(let i = 0; i < len; i++) {
            if (tripList[i].is_default == 0)
                list += `<a href="javascript:void(0)" id="${i}">${tripList[i].name}</a>`;
            else {
                list += `<a href="javascript:void(0)" id="${i}" class="default-trip">${tripList[i].name}</a>`;
                $('#tsrs-trip-name').text(tripList[i].name).attr('href', 'http://www.tripsurfing.co/trip/l/' + tripList[i].id);
                renderTrip(i, tripDetail[i]);
            }
        }
        document.getElementById('tsrs-dropdown-content').innerHTML = list;        
    }

}
$(()=>{startLoading();});