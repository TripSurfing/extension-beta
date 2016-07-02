const chromeUrl = url => chrome.extension.getURL(url);
$('body').append(
	`<div id="right-side">
        <div id="right-side-nav-tabs">
            <i class="tsrs-icon-list">
                <div class="my-dropdown-content">
                    <a href="javascript:void(0)" id="74">test</a>
                    <a href="javascript:void(0)" id="80" class="default-trip">Philippines 2</a>
                    <a href="javascript:void(0)" id="73">Philippines</a>
                    <a href="javascript:void(0)" id="72">Siquijor Island</a>
                    <a href="javascript:void(0)" id="27">First trip</a>
                </div>
            </i>
            <div id="tsrs-trip-name"></div>
        </div>

        <div id="tsrs-nav">
            <ul class="tsrs-nav-ul">
                <li id="tsrs-nav-li-link" class="tsrs-nav-li-tab">
                    <a class="tsrs-nav-a">
                        <i class="tsrs-icon-link" title="Links" tsrs-data="tipsy"></i>
                    </a>
                </li>

                <li id="tsrs-nav-li-place" class="tsrs-nav-li-tab">
                    <a class="tsrs-nav-a">
                        <i class="tsrs-icon-location-pin tsrs-nav-i-active" title="Places" tsrs-data="tipsy"></i>
                    </a>
                </li>
            </ul>

            <div id="place-tab" class="tsrs-nav-tab-content tsrs-tab-active"></div>
            <div id="link-tab" class="tsrs-nav-tab-content"></div>
        </div>
    </div>
    <div id='btn-tool-selector' class="btn-group">
        <div id="btn-tool-show" class="not-show">
            <img src="${chromeUrl("image/icon38.png")}" />
        </div>
    </div>`);
/**
 * Created by Nguyễn Hữu Hoàng Sơn on 5/20/2016.
 */
const rightSide = $("#right-side");

/*
 * Delete a box
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
    this.title = heart.hasClass('favorite-active') ? "Remove from favorite" : "Add to favorite";
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

$('#btn-tool-show').click( function() {
    rightSide.slideToggle(700,"swing", function() {
        $('#btn-tool-show').toggleClass('not-show show');
    });
});

rightSide.on('click', '.my-dropdown-content a', function() {
    let tripId = parseInt(this.id);
    let text = $(this).text(); 

    clearWindow( () => {
        renderTrip(tripId);
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

    $(".tsrs-nav-li-tab a i").removeClass('tsrs-nav-i-active');
    $(this).children('a').children('i').addClass('tsrs-nav-i-active');
});