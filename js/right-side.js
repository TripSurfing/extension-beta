/**
 * Created by Nguyễn Hữu Hoàng Sơn on 5/20/2016.
 */
const rightSide = $("#right-side");
$(() => {
    load();
});

/*
 * Delete a box
 *
 */

rightSide.on("click", ".delete-btn", function() {
    let boxParent = $(this).parents('div.box');
    boxParent.children('div.box-info', 'div.box-image').addClass('box-blur');
    boxParent.prepend(
        `<div class="box-confirm">
            <div class="box-confirm-content">
                <p>Are you sure?</p>
                <button type="button" class="btn-confirm-no">No</button>
                <button type="button" class="btn-confirm-yes">Yes</button>
            </div>
        </div>`);
});
rightSide.on('click', '.btn-confirm-no',function() {
    let parent = $(this).parents('div.box-confirm');
    parent.siblings('.box-info', '.box-image').removeClass('box-blur');
    parent.remove();

});
rightSide.on('click', '.btn-confirm-yes',function() {
    // $(this).parents('div.box').remove();
    $(this).parents("div.box").fadeOut(300, function() {
        // Sau này muốn thêm chức năng undo, bỏ dòng này đi
        $(this).remove();
    });
    /*Do something to server here*/
});

rightSide.on("click", ".tsrs-icon-heart", function() {
    let heart = $(this);
    heart.toggleClass("favorite-active favorite-not-active");
    // if (heart.hasClass('favorite-active')) {
    //     $.post('wwww.tripsurfing.co/api/favorite', 
    //         {
    //             itemId:,
    //             type:,
    //             action: 'add'
    //         }
    //     );
    // }
});

/*
    rightSide close
    */
const updatePlace = placeList => {
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
                            <h4 class="tsrs-title-wrap">${place.name}</h4>
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
const updateLink = linkList => {
    linkList.forEach(link => {
        item =
            `<div class="box">
                <a class="box-image" href=${link.url} target="_blank">
                    <div class="image" style="background-image: url(${link.image})"></div>
                </a>
                <div class="box-info">
                    <a href=${link.url} class="box-title"  target="_blank" title="${link.title}">
                        <h4 class="media-heading tsrs-title-wrap">` + link.title + `</h4>
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

const load = tripId => {
    if (isNaN(tripId)) {
        let defaultTrip = $(".default-trip")[0];
        tripId = +defaultTrip.id;
        $("#tsrs-trip-name").text(defaultTrip.text);
    }
    $.ajax({
        type: 'GET',
        url: 'http://www.tripsurfing.co/api/testRenderTrip',
        data: {"tripId": tripId},
        jsonpCallback: 'my_callback',
        dataType: 'jsonp',
        contentType: "application/json",
        crossDomain: true,

    })
    .done(res => {
        switch(res.type) {
            case "success":
                updatePlace(res.place);
                updateLink(res.link);
                $('[tsrs-data="tipsy"]').tipsy({
                    gravity: 'se',
                    fade: true,
                    delayIn: 400
                });
                break;
            case "error":
                announceError(res.message);
                break;
        } 
    })
    .always(res => {
        console.log(res);
    });

}
const clearWindow = callback => {
    $("#link-tab").children("div").remove();
    $("#place-tab").children("div").remove();
    callback();
}

$('#btn-tool-show').click( function() {
    // if ($('#btn-tool-show').hasClass("not-show")) {
    //     clearWindow(load);
    //     // load(); 
    // }
    rightSide.slideToggle(700,"swing", function() {
        $('#btn-tool-show').toggleClass('not-show show');
    });
});

rightSide.on('click', '.my-dropdown-content a', function() {
    let tripId = parseInt(this.id);
    let text = $(this).text(); 


    clearWindow( () => {
        load(tripId);
    });
    $('#tsrs-trip-name').text(text);
});

/*  Change Tab function
*   .tsrs-tab-active:     tab is active now
*   .tsrs-nav-a-active:   icon is active now
*
 */
const tabsKey = {
    // id-tab : id-tab-content
    "tsrs-nav-li-place": "#place-tab",
    "tsrs-nav-li-link" : "#link-tab"
}
$(".tsrs-nav-li-tab").click(function() { 
    let displayTab = tabsKey[this.id]; 
    $(".tsrs-tab-active").fadeOut(220, function() {
        $(this).removeClass("tsrs-tab-active");
        $(displayTab).addClass("tsrs-tab-active");
    });
    $(".tsrs-nav-li-tab").removeClass('tsrs-nav-a-active');
    $(this).addClass('tsrs-nav-a-active');
});