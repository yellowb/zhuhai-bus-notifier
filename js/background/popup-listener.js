// JS to communicate with popup.js

function handlePopupRequest(msg) {

    switch (msg) {
        case REQ.GET_BUS_REALTIME_DATA:
            return JSON.stringify({
                respKey: RESP.RETURN_BUS_REALTIME_DATA,
                data: latestCalculatedResults
            });
        case REQ.GET_META_DATA:
            return JSON.stringify({
                respKey: RESP.RETURN_META_DATA,
                data: latestMetaData
            });
        default:
            return JSON.stringify({});
    }


}
