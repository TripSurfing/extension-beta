const chromeUrl = url => chrome.extension.getURL(url);
const addExt = () => {
    if (SWITCH_STATE == true) {
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
                    <li id="tsrs-nav-li-quote" class="tsrs-nav-li-tab">
                        <a class="tsrs-nav-a">
                            <i class="tsrs-icon-quote tsrs-entypo" title="Quotes" tsrs-data="tipsy"></i>
                        </a>
                    </li>

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

                <div id="place-tab" class="tsrs-nav-tab-content tsrs-tab-active">
                    <div id = 'tsrs-place-group' class='tsrs-box-group'></div>
                    <div id="tsrs-quantity-place" class="tsrs-quantity"></div>
                </div>

                <div id="link-tab" class="tsrs-nav-tab-content tsrs-entypo">
                    <div id = 'tsrs-link-group' class='tsrs-box-group'></div>
                    <div id="tsrs-quantity-link" class="tsrs-quantity"></div>
                </div>

                <div id="quote-tab" class="tsrs-nav-tab-content tsrs-entypo">
                    <div id = 'tsrs-quote-group' class='tsrs-box-group'></div>
                    <div id="tsrs-quantity-quote" class="tsrs-quantity"></div>
                </div>

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
                <a href="${chromeUrl("right-side/options/options.html")}" target="_blank">                
                <div class='tsrs-btn-background-div'><i class='tsrs-icon-cog tsrs-entypo'></i></div>
                </a>
            </div>

            <div id="tsrs-btn-tool-switch" class="tsrs-btn-descoration-small tsrs-animated tsrs-fadeOutDown" title="Turn Off" tsrs-btn="tipsy">
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
            if (boxParent.hasClass('quotes-tab')) {
                boxParent.next('div.tsrs-quote-list').slideUp();
            }
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
            let boxParent = $(this).parents('div.box');
            parent.siblings('.box-info', '.box-image').removeClass('box-blur');
            parent.remove();
            if (boxParent.hasClass('quotes-tab')) {
                boxParent.next('div.tsrs-quote-list').slideDown();
            }
        });
        rightSide.on('click', '.btn-confirm-yes',function() {
            // $(this).parents('div.box').remove();
            let box = $(this).parents('div.box');
            box.fadeOut(300, function() {
                // Sau này muốn thêm chức năng undo, bỏ dòng này đi
                deleteItem(box[0].id);
            });
            /*Do something to server here*/
        });

        /**
         * Delete quote groups
         */
        // rightSide.on('click', '.delete-quote-group', function() {
        //     let boxParent = $(this).parents('div.box');
        //     boxParent.children('div.box-info', 'div.box-image').addClass('box-blur');
        //     boxParent.prepend(
        //         `<div class="box-confirm">
        //             <div class="box-confirm-content">
        //                 <p>Are you sure?</p>
        //                 <button type="button" class="btn-confirm-no">No</button>
        //                 <button type="button" class="btn-confirm-yes">Yes</button>
        //             </div>
        //         </div>`);
        //     boxParent.next('div.tsrs-quote-list').slideUp();
        // });



        rightSide.on("click", ".tsrs-icon-heart", function() {
            let box = $(this).parents('div.box');
            let heart = $(this);
            heart.toggleClass("favorite-active favorite-not-active").promise().done(heart => {
                if (heart.hasClass('favorite-active')) {
                    this.title = 'Remove from favorite';
                    addToFavorite(box[0].id);
                } else {
                    this.title = 'Add to favorite';
                    removeFromFavorite(box[0].id);
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

        /*
        *   Turn off extension
         */
        $('#tsrs-btn-tool-switch').click(()=>{
            // $('#tsrs-btn-tool-selector').hide().promise().done($);
            SWITCH_STATE = false;
            switchOff();
        });
        /**
         * Save Link
         */
        $('#tsrs-btn-tool-savelink').click(() => {
            saveLink();
        });
        /**
         * Open a trip
         */
        rightSide.on('click', '#tsrs-dropdown-content a', function() {
            // document.getElementById('tsrs-dropdown-content').style.visibility= 'hidden';
            let i = parseInt(this.id);
            let text = $(this).text();
            CURRENT_TRIP_ID = +this.dataset.tripid;
            renderTrip(i, TRIP_DETAIL[i]);

            $('#tsrs-trip-name').text(text).attr('href', 'http://www.tripsurfing.co/trip/l/' + TRIP_LIST[i].id);
        });

        
        /*  Change Tab function
        *   .tsrs-tab-active:     tab is active now
        *   .tsrs-nav-a-active:   icon is active now
        *
         */
        const tabsKey = {
            // id-tab : id-tab-content
            "tsrs-nav-li-place": "#place-tab",
            "tsrs-nav-li-link" : "#link-tab",
            'tsrs-nav-li-quote': '#quote-tab',
        }
        $(".tsrs-nav-li-tab").click(function() { 
            let displayTab = tabsKey[this.id]; 
            // showQuantity(displayTab);
            $(".tsrs-tab-active").fadeOut(220, function() {
                $(this).removeClass("tsrs-tab-active");
                $(displayTab).addClass("tsrs-tab-active");
            });

            $(".tsrs-nav-li-tab a i").removeClass('tsrs-nav-i-active');
            $(this).children('a').children('i').addClass('tsrs-nav-i-active');
        });
        
        /*
        *   Expand/Collapse quotes from link
         */       
        rightSide.on('click', '.link-bag__bottom a', function(event) {
            // $(this).parents('div.box').toggleClass('tsrs-shadow');
            let boxParent = $(this).parents('div.box');
            let quoteList = boxParent.next('.tsrs-quote-list');
            if (quoteList.hasClass('tsrs-quote-showing')) {
                quoteList.slideUp(400, function () {
                    quoteList.removeClass('tsrs-quote-showing');
                })
            } else {
                quoteList.slideDown(400, function() {
                    quoteList.addClass('tsrs-quote-showing');
                });
            }
            $(this).children('i').toggleClass('tsrs-icon-chevron-down tsrs-icon-chevron-up');
        });

        /*
        *   Delete a quote
         */ 
        rightSide.on('click', '.tsrs-quote__delete', function() {
            let quote = $(this).parents('div.tsrs-quote');
            quote.fadeOut(300, function() {
                // Call to controller
                deleteQuote(quote[0].id);
            });
        });
    }
}
// addExt();