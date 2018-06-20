// JS to communicate with popup.js

/**
 * Handler for message from popup.js
 * @param msg
 * @returns {string}
 */
function handlePopupRequest(msg) {

    let req = JSON.parse(msg);

    switch (req.reqKey) {
        // Get bus real time data.
        case REQ.GET_BUS_REALTIME_DATA:
            return JSON.stringify({
                respKey: RESP.RETURN_BUS_REALTIME_DATA,
                data: latestCalculatedResults
            });
        // Get meta data(last update time...)
        case REQ.GET_META_DATA:
            return JSON.stringify({
                respKey: RESP.RETURN_META_DATA,
                data: latestMetaData
            });
        // Get flags for switches
        case REQ.GET_FLAGS:
            return JSON.stringify({
                respKey: RESP.RETURN_FLAGS,
                data: {
                    executionFlag: executionFlag,
                    alarmFlag: alarmFlag
                }
            });
        // Set flags for switches
        case REQ.SET_FLAGS: {
            let reqBody = req.data;
            setFlags(reqBody.executionFlag, reqBody.alarmFlag, true);
            return JSON.stringify({});
        }
        default:
            return JSON.stringify({});
    }
}
