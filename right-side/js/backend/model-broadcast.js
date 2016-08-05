/**
 * Long-polling
 */

const poll = ( LAST_TIME = Math.round(Date.now()/1000) ) => {
	if (LAST_TIME === null) LAST_TIME = Math.round(Date.now()/1000);
	SWITCH_STATE = smartStorage.get('switchState');
	if (SWITCH_STATE === undefined || SWITCH_STATE === null) {
		smartStorage.set('switchState', true);
		SWITCH_STATE = true;
	}
	// console.log(SWITCH_STATE);
	if (SWITCH_STATE == true) {
		pollAjax = $.ajax({
			url: TRIPSURFING_API_URL + 'api/updateTripList',
			type: 'POST',
			dataType: 'json',
			data: {
				userId: USER_ID,
				lastTime: LAST_TIME
			},
		})
		.done(response => {
			if (response.type == 'success') {
				LAST_TIME = Math.round(Date.now()/1000);
				console.log('new update at: ', LAST_TIME);
				getTripListFromDb(true);
			} else {
				poll(LAST_TIME);
			}
			// poll(LAST_TIME);
			// console.log(LAST_TIME);
		})
		.fail(response => {
			console.log(response);
			startPoll();
		});
	}
	
}
const startPoll = () => {
	
	setTimeout(function() {
		poll(LAST_TIME);
	}, 5000);
}
// if (isLoggedIn()) {
// 	startPoll();
// }
// startPoll();

// 1 468 661 959 032
