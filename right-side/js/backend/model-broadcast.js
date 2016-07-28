/**
 * Long-polling
 */

const poll = ( LAST_TIME = Math.round(Date.now()/1000) ) => {
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
		console.log(LAST_TIME);
	})
	.fail(response => {
		console.log(response);
		poll(LAST_TIME);
	});
	
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
