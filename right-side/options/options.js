announce = document.getElementById('announce');
save = () => {	
	let check = document.getElementById('check-tripadvisor').checked;
	console.log(check);
	chrome.runtime.sendMessage(
		{
			request: 'setTripAdvisorState',
			state: check
		}
	);
	
	announce.style.display = 'block';
	setTimeout(()=> {
		announce.style.display = 'none';
	}, 2500)
}
chrome.runtime.sendMessage(
	{
		request: 'getTripAdvisorState'
	},
	function(state) {
		if (state == true) {
			document.getElementById('check-tripadvisor').checked = 'checked';
		}
	}
);
document.getElementById('save-btn').addEventListener('click', save)
