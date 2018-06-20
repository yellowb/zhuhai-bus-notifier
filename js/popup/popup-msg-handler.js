
const GET_BUS_REALTIME_DATA = 'Get.BusRealTimeData';
const GET_META_DATA = 'Get.MetaData';

let port = chrome.extension.connect({
    name: "Sample Communication"
});
port.onMessage.addListener(function (msg) {
    console.log(`[Background.js] received msg: ${msg}`);
    let response = JSON.parse(msg);
    refreshBusesRealTimeData(response);
});

// Init data when opening popup
requestBackgroudForData();

setInterval(function () {
    requestBackgroudForData()
}, INTERVAL_OF_CHECK_BUS);

function requestBackgroudForData() {
    port.postMessage(GET_BUS_REALTIME_DATA);
    // port.postMessage(GET_META_DATA);
}

function refreshBusesRealTimeData(calculatedResults) {
    $('#buses-real-time-data').html(entireAccordionTemplate(calculatedResults));
    //TODO also refresh the latest update time
}



