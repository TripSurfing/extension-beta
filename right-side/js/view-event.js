const chromeUrl = url => chrome.extension.getURL(url);
const addExt = () => {
    if (switchState == true) {
        $('body').append( 
    	`<div id="right-side">
            <div id="right-side-nav-tabs">
                <i class="tsrs-icon-menu tsrs-entypo">
                    <div id="tsrs-dropdown-content">
                    </div>
                </i>
                <a id="tsrs-trip-name" target="_blank"></a>
            </div>

            <div id="tsrs-nav">
                <ul class="tsrs-nav-ul">
                    <li id="tsrs-nav-li-link" class="tsrs-nav-li-tab">
                        <a class="tsrs-nav-a">
                            <i class="tsrs-icon-link tsrs-entypo" title="Links" tsrs-data="tipsy"></i>
                        </a>
                    </li>

                    <li id="tsrs-nav-li-place" class="tsrs-nav-li-tab">
                        <a class="tsrs-nav-a">
                            <i class="tsrs-icon-location-pin tsrs-nav-i-active tsrs-entypo" title="Places" tsrs-data="tipsy"></i>
                        </a>
                    </li>
                </ul>

                <div id="place-tab" class="tsrs-nav-tab-content tsrs-tab-active tsrs-entypo"></div>
                <div id="link-tab" class="tsrs-nav-tab-content tsrs-entypo"></div>
            </div>
        </div>
        
        <div id='tsrs-btn-tool-selector'>
            <div id="tsrs-btn-tool-show" class="tsrs-not-show tsrs-btn-descoration">
                <img src="${chromeUrl("right-side/image/icon38.png")}" />
            </div>

            <div id="tsrs-btn-tool-savelink" class="tsrs-btn-descoration-small tsrs-animated tsrs-fadeOutDown" title="Save link" tsrs-btn="tipsy">
                <div class='tsrs-btn-background-div'><i class='tsrs-icon-bookmark tsrs-entypo'></i></div>
            </div>

            <div id="tsrs-btn-tool-setting" class="tsrs-btn-descoration-small tsrs-animated tsrs-fadeOutDown" title="Setting" tsrs-btn="tipsy">
                <div class='tsrs-btn-background-div'><i class='tsrs-icon-cog tsrs-entypo'></i></div>
            </div>

            <div id="tsrs-btn-tool-switch" class="tsrs-btn-descoration-small tsrs-animated tsrs-fadeOutDown" title="Switch on/off" tsrs-btn="tipsy">
                <div class='tsrs-btn-background-div'><i class='tsrs-icon-switch tsrs-entypo'></i></div>
            </div>
        </div>`);
        $('[tsrs-btn="tipsy"]').tipsy({
                gravity: 's',
                fade: true,
                delayIn: 200
            });
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
            let box = $(this).parents('div.box');
            box.fadeOut(300, function() {
                // Sau này muốn thêm chức năng undo, bỏ dòng này đi
                deleteItem(box[0]);
            });
            /*Do something to server here*/
        });

        rightSide.on("click", ".tsrs-icon-heart", function() {
            let box = $(this).parents('div.box');
            let heart = $(this);
            heart.toggleClass("favorite-active favorite-not-active").promise().done(heart => {
                if (heart.hasClass('favorite-active')) {
                    this.title = 'Remove from favorite';
                    addToFavorite(box[0]);
                } else {
                    this.title = 'Add to favorite';
                    removeFromFavorite(box[0]);
                }
            });
            // this.title = heart.hasClass('favorite-active') ? "Remove from favorite" : "Add to favorite";

        });

        /*
            rightSide close
            */

        const btnGroup = $('#tsrs-btn-tool-setting, #tsrs-btn-tool-switch, #tsrs-btn-tool-savelink');
        $('#tsrs-btn-tool-show').click( function() {
            $(this).toggleClass('tsrs-not-show tsrs-show');
            rightSide.slideToggle(700,"swing");
            
        });
        $('#tsrs-btn-tool-show').mouseenter(() => {
            // $('#btn-tool-selector').css('width', '250px');
            btnGroup.removeClass('tsrs-fadeOutDown').addClass('tsrs-slideInUp').css('display', 'block');
            // $('#tsrs-btn-group').css('display', 'block');
        });

        $('#tsrs-btn-tool-selector').mouseleave(() => {
            if ($('#tsrs-btn-tool-show').hasClass('tsrs-not-show')){
                btnGroup.toggleClass('tsrs-slideInUp tsrs-fadeOutDown');
                setTimeout(()=>{btnGroup.hide()}, 100);
                // btnGroup.fadeOut('slow', 'linear');
                // btnGroup.fadeOut(400);
            }
        });

        $('#tsrs-btn-tool-switch').click(()=>{
            // $('#tsrs-btn-tool-selector').hide().promise().done($);
            switchState = false;
            switchOff();
        });
        $('#tsrs-btn-tool-savelink').click(() => {
            saveLink();
        });
        rightSide.on('click', '#tsrs-dropdown-content a', function() {
            let i = parseInt(this.id);
            let text = $(this).text(); 

            clearWindow( () => {
                renderTrip(i, tripDetail[i]);
            });
            $('#tsrs-trip-name').text(text).attr('href', 'http://www.tripsurfing.co/trip/l/' + tripList[i].id);
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
        
    }
}
addExt();