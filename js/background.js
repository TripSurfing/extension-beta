chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        switch (message.type) {
            case "getTripById":
                $.ajax({
                        url: 'http://www.tripsurfing.co/api/renderTrip',
                        type: 'POST',
                        dataType: 'json',
                        data: message.data,
                        crossDomain: true
                    })
                    .done(res => sendResponse(res))
                    .error(res => sendResponse(res))
                    .always(res => console.log(res))
                break;
        };
        return true;
    });
