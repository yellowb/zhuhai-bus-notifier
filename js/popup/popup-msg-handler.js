let port = chrome.extension.connect({
    name: "Sample Communication"
});
port.onMessage.addListener(function (msg) {
    console.log(`[Background.js] received msg: ${msg}`);
    let response = JSON.parse(msg);
    refreshBusesRealTimeData(response);
});

// Init data when opening popup
port.postMessage("Get.BusRealTimeData");

setInterval(function () {
    port.postMessage("Get.BusRealTimeData");
}, INTERVAL_OF_CHECK_BUS);

function refreshBusesRealTimeData(calculatedResults) {
    $('#buses-real-time-data').html(entireAccordionTemplate(calculatedResults));
}



