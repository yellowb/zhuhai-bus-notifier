// JS to communicate with popup.js

function handlePopupRequest(msg) {
    if (msg === 'Get.BusRealTimeData') {
        return JSON.stringify(latestCalculatedResults);
    }
    else if (msg === 'Get.MetaData') {
        return JSON.stringify(latestMetaData);
    }
    else {
        return JSON.stringify({});
    }
}
