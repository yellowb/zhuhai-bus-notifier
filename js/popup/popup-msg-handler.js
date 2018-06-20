let port = chrome.extension.connect({
    name: "Sample Communication"
});
port.onMessage.addListener(function (msg) {
    console.log(`[Background.js] received msg: ${msg}`);
    let response = JSON.parse(msg);
    handleBackgroundResponse(response);
});

// Sent msgs to background for data.
function requestBackgroundForData() {
    port.postMessage(JSON.stringify({reqKey: REQ.GET_BUS_REALTIME_DATA}));
    port.postMessage(JSON.stringify({reqKey: REQ.GET_META_DATA}));
    port.postMessage(JSON.stringify({reqKey: REQ.GET_FLAGS}));
}

// Handler for response from background.
function handleBackgroundResponse(response) {
    if (_.isEmpty(response)) {
        return;
    }
    switch (response.respKey) {
        case RESP.RETURN_BUS_REALTIME_DATA: {
            refreshBusesRealTimeData(response.data);
            break;
        }
        case RESP.RETURN_META_DATA: {
            refreshMetaData(response.data);
            break;
        }
        case RESP.RETURN_FLAGS: {
            refreshFlags(response.data);
            break;
        }
        default:
            break;
    }
}

// Refresh the accordion with latest bus real time data.
function refreshBusesRealTimeData(calculatedResults) {
    $('#buses-real-time-data').html(entireAccordionTemplate(calculatedResults));
}

// Refresh other meta data.
function refreshMetaData(metaData) {
    if (!(_.isUndefined(metaData.lastUpdateTime) || _.isNull(metaData.lastUpdateTime))) {
        let lastUpdateTimeStr = moment(metaData.lastUpdateTime).format(DISPLAY_DATE_FORMAT);
        $('#last-update-time-label').html(`最后更新于: ${lastUpdateTimeStr}`);
    }
    else {
        $('#last-update-time-label').html('');
    }
}

function refreshFlags(flags) {
    $('#execution-switch').prop('checked', flags.executionFlag);
    $('#alarm-switch').prop('checked', flags.alarmFlag);
}

// Listener for switches
$('input:checkbox').change(function () {
    let flags = {
        executionFlag: $('#execution-switch').is(":checked"),
        alarmFlag: $('#alarm-switch').is(":checked")
    };
    // Sync to background
    port.postMessage(JSON.stringify({
        reqKey: REQ.SET_FLAGS, data: flags
    }));
});

// Startup!
(function (){
    // Init data when opening popup
    requestBackgroundForData();

    // Auto refresh UI data
    setInterval(function () {
        requestBackgroundForData()
    }, INTERVAL_OF_CHECK_BUS);
})();


