// JS to communicate with popup.js

function handlePopupRequest(msg) {
    if (msg === 'Get.BusRealTimeData') {
        return JSON.stringify(latestCalculatedResults);
    }
    else {
        return JSON.stringify({});
    }
}
