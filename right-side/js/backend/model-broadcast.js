/**
 * Long-polling
 */

const poll = ( lastTime = Math.round(Date.now()/1000) ) => {
	$.ajax({
		url: tripSurfingUrl + 'api/updateTripList',
		type: 'POST',
		dataType: 'json',
		data: {
			userId: userId,
			lastTime: lastTime
		},
	})
	.done(response => {
		if (response.type == 'success') {
			lastTime = Math.round(Date.now()/1000);
			console.log('new update at: ', lastTime);
			getTripListFromDb(true);
		} else {
			poll(lastTime);
		}
		// poll(lastTime);
		console.log(lastTime);
	})
	.fail(response => {
		console.log(response);
	});
	
}
const startPoll = () => {
	setTimeout(function() {
		poll(lastTime);
	}, 5000);
}

// 1 468 661 959 032
