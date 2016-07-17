/**
 * Long-polling
 */

const poll = (lastTime) => {
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
			getTripListFromDb();
		}
		poll(lastTime);
		console.log(lastTime);
	})
	.fail(response => {
		console.log(response);
	});
	
}
setTimeout(function() {
	poll(lastTime);
}, 5000);

// 1 468 661 959 032
