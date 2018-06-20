// JS to communicate with popup.js

function handlePopupRequest(msg) {

    let req = JSON.parse(msg);

    switch (req.reqKey) {
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
        case REQ.GET_FLAGS:
            return JSON.stringify({
                respKey: RESP.RETURN_FLAGS,
                data: {
                    executionFlag: executionFlag,
                    alarmFlag: alarmFlag
                }
            });
        case REQ.SET_FLAGS: {
            let reqBody = req.data;
            setFlags(reqBody.executionFlag, reqBody.alarmFlag, true);
            return JSON.stringify({});
        }
        default:
            return JSON.stringify({});
    }


}
