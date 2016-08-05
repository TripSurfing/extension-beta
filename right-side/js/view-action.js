// const render = (selector, items) => {
//     $(selector).append(items);
// }
const favoriteState = favorites => {
    if (favorites.length == 0) return ['favorite-not-active', 'Add to favorite'];
    else {
        for (let i = 0, len = favorites.length; i < len; i++) {
			let user = favorites[i];
            if (user.user_id == USER_ID) return ['favorite-active', 'Remove from favorite'];
        }
        return ['favorite-not-active', 'Add to favorite'];
    }
}
const renderPlaceTab = (menuId, placeList) => {
    let list ='';
    let leng = placeList.length;

    if (leng < 2) document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' place';
    else document.getElementById('tsrs-quantity-place').innerHTML = leng.toString() + ' places';

    if (leng == 0) announceEmpty('tsrs-place-group');
    else {
        for (let i = 0, leng = placeList.length; i < leng; i++) {
            let place = placeList[i];
            let img_url = place.images.length != 0 ? place.images[0].url : "http://www.tripsurfing.co/static/img/noimg.jpg";
            let favoriteInfo = favoriteState(place.favorites);
            let rate = (+place.rate_avg != 0) ? place.rate_avg : 'Not voted yet';
            let address = (place.address != null) ? place.address : ' ';
            // place_id = favorite, place.id = delete
            list +=
                `<div class="box" id="place-${place.place_id}-${place.id}" data-location="${menuId}-places-${i}">
                        <a class="box-image" href= ${place.url} target="_blank">
                            <div class="image" style="background-image: url(${img_url})"> </div>
                        </a>
                        
                        <div class="box-info">
                            <a href=${place.url} class="box-title" target="_blank" title="${place.name}">
                                <div class="tsrs-title-wrap">${place.name}</div>
                            </a>
                            
                            <div class="box-desc" title="${address}">${address}</div>
                            
                            <div class="place-bottom">
                                <div class="tsrs-rating">
                                    <i class="tsrs-icon-star"></i> ${rate}
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
        document.getElementById('tsrs-place-group').innerHTML = list;
    }
}
const renderLinkTab = (menuId, linkList) => {
    let list = '';
    let leng = linkList.length;
    if (leng < 2) document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' link';
    else document.getElementById('tsrs-quantity-link').innerHTML = leng.toString() + ' links';
    if (leng == 0) announceEmpty('tsrs-link-group');
    else {
        for (let i = 0; i < leng; i++) {
            let link = linkList[i];
            let img_url = (link.image !== null && link.image != "") ? link.image : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
            let favoriteInfo = favoriteState(link.favorites);
            list +=
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
        document.getElementById('tsrs-link-group').innerHTML = list;
    }
    // if (linkList.length > 3) $("#saved-links-id").append(nomore);
}

const renderQuoteTab = (menuId, quoteList) => {
    let len = quoteList.length;
    // console.log('Hello quote');
    if (len < 2) document.getElementById('tsrs-quantity-quote').innerHTML = len.toString() + ' quote';
    else document.getElementById('tsrs-quantity-quote').innerHTML = len.toString() + ' quotes';
    if (len == 0) announceEmpty('tsrs-quote-group');
    else {
        // console.time('save quote to ...');
        QUOTE_BAG_LINK = {};
        for (let i = 0; i < len; i++) {
            let quote = quoteList[i];
            // let url = quote.pageUrl;
            let url = quote.from_url;
            if (QUOTE_BAG_LINK[url] === undefined) {
                QUOTE_BAG_LINK[url] = {
                    linkId      : quote.link_id,
                    imgUrl  : quote.image,
                    title   : quote.title,
                    desc    : quote.description,
                    quotes  : {},
                };
            }
            QUOTE_BAG_LINK[url].quotes[quote.id] = quote.content;
        }
        // console.timeEnd('save quote to ...');
        // console.log(QUOTE_BAG_LINK);
        renderQuotes(menuId);
    }
}
const renderQuotes = (menuId) => {
    // console.log(QUOTE_BAG_LINK);
    let list = '';
    let urls = Object.keys(QUOTE_BAG_LINK);
    let len = urls.length;
    for (let i = 0; i < len; i++) {
        let link = QUOTE_BAG_LINK[urls[i]];
        let imgUrl = (link.imgUrl !== null && link.imgUrl != "") ? link.imgUrl : "http://www.tripsurfing.co/static/img/noimg.jpg"; 
        
        let quoteIdList = Object.keys(link.quotes);
        let quoteNumber = quoteIdList.length;
        list +=
                `<div class="box quotes-tab" id="tsrs-link__bag-${link.linkId}" data-location="${menuId}-quotes-${i}" data-url="${urls[i]}">
                    <a class="box-image" href=${urls[i]} target="_blank">
                        <div class="image" style="background-image: url(${imgUrl})"></div>
                    </a>
                    <div class="box-info">
                        <a href=${urls[i]} class="box-title"  target="_blank" title="${link.title}">
                            <div class="tsrs-title-wrap">${link.title}</div>
                        </a>
                        <div class="box-desc" title="${link.desc}">${link.desc}</div>
                        
                        <div class="link-bag__bottom">
                            <a>
                                ${quoteNumber} quote(s) from this website <i class='tsrs-icon-chevron-down tsrs-entypo'></i>
                            </a>
                            <div class="delete-btn">
                                <i class="tsrs-icon-trash" title="Delete all quotes" tsrs-data="tipsy"></i>
                            </div>
                        </div>
                    </div>
                </div>
            <div class="tsrs-quote-list">
                `;
        for (let j = 0; j < quoteNumber; j++) {
            let quoteId = quoteIdList[j];
            let quoteContent = link.quotes[quoteId];
            list += `
                <div class="tsrs-quote" id="tsrs-quoteId-${quoteId}">
                    <div class="tsrs-quote__content">
                        <div class='tsrs-icon--rotate'><i class='tsrs-icon-quote tsrs-entypo'></i></div>
                        ${quoteContent}
                        <i class='tsrs-icon-quote tsrs-entypo'></i>
                    </div>
                    <div class="tsrs-quote__delete" title="Delete quote" tsrs-data="tipsy">
                        <i class='tsrs-icon-circle-with-cross tsrs-entypo'></i>
                    </div>
                 </div>
            `;
        }
        list += `</div>`;
    }

    document.getElementById('tsrs-quote-group').innerHTML = list;
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
    document.getElementById(nameTab).innerHTML = emptyAnnouncement;
}
const renderTripList = (refresh = false) => {
    let list = '';
    let len = TRIP_LIST.length;
    if (len == 0 || len == undefined || len == null) {
        document.getElementById('tsrs-trip-name').innerHTML = 'No trips :(';
    } else if (CURRENT_TRIP_ID === null) {
        for(let i = 0; i < len; i++) {
            let trip = TRIP_LIST[i];
            if (trip.is_default == 0)
                list += `<a href="javascript:void(0)" data-tripId='${trip.id}' id="${i}">${trip.name}</a>`;
            else {
                list += `<a href="javascript:void(0)" id="${i}" data-tripId='${trip.id}' class="default-trip">${trip.name}</a>`;
                $('#tsrs-trip-name').text(trip.name).attr('href', 'http://tripsurfing.co/trip/l/' + trip.id);
                renderTrip(i, TRIP_DETAIL[i]);
            }
        }
    } else {
        for(let i = 0; i < len; i++) {
            let trip = TRIP_LIST[i];
            list += `<a href="javascript:void(0)" id="${i}" data-tripId='${trip.id}'>${trip.name}</a>`;
            if (trip.id == CURRENT_TRIP_ID) {
                $('#tsrs-trip-name').text(trip.name).attr('href', 'http://tripsurfing.co/trip/l/' + trip.id);
                renderTrip(i, TRIP_DETAIL[i]);
            }
        }
    }
    if (refresh == true) $('.tipsy').remove();
    document.getElementById('tsrs-dropdown-content').innerHTML = list;        
}
$(()=>{startLoading();});
