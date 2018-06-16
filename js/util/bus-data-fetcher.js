/**
 * Common functions for fetching data from bus webservice
 *
 **/

/**
 * Url parameter used in fetching bus line info.
 * @type {string}
 */
const HANDLER_NAME_FETCH_BUS_LINE_INFO = 'GetLineListByLineName';

const LINE_NUMBER_CHN_SUFFIX = '路';

/**
 * Convert bus line info data from webservice to own format.
 * @param wsData
 */
function convertBusLineInfoData(wsData) {
    let lines = _.map(wsData, function (n) {
        let lineNumber = n['LineNumber'];
        // Sometimes the response lineNumber ends with chinese char '路', need to ignore it.
        lineNumber = lineNumber.charAt(lineNumber.length - 1) === LINE_NUMBER_CHN_SUFFIX ?
            lineNumber.substring(0, lineNumber.length - 1) : lineNumber;
        return {
            'uuid': n['Id'],
            'lineNumber': lineNumber,
            'fromStation': n['FromStation'],
            'toStation': n['ToStation']
        }
    });
    return lines;
}

/**
 * Convert bus line station list data from webservice to own format.
 * @param wsData
 */
function convertStationListData(wsData) {
    let stations = _.map(wsData, function (n) {
        return {
            'uuid': n['Id'],
            'name': n['Name']
        }
    });
    return stations;
}

function convertBusStatusListData(wsData) {
    let busStatusList = _.map(wsData, function (n) {
        return {
            'busNumber': n['BusNumber'],
            'currentStation': n['CurrentStation'],
            'status': n['LastPosition']
        }
    });
    return busStatusList;
}

/**
 * Fetch bus line basic info & station list by bus line#
 * @param lineNumber
 * @param callback
 */
function fetchBusLineData(lineNumber, callback) {
    if (_.isUndefined(lineNumber) || _.isNull(lineNumber)) {
        return callback(null, []);
    }

    // Call webservice
    // Get the basic info first, typically there are 2 line directions for one bus line#
    axios.get(BUS_LINE_INFO_URL, {
        params: {
            'handlerName': HANDLER_NAME_FETCH_BUS_LINE_INFO,
            'key': lineNumber
        }
    })
        .then(function (response) {
            if (response.status !== 200) {  // network exception
                throw new Error(`Error in calling webservice to get bus line# ${lineNumber} info. Response ${response.status} : ${response.statusText}`);
            }
            else {
                let wsData = _.get(response, 'data.data');  // Suppose it is an array, check notes.md
                let lines = [];  // data to be returned.
                if (_.isArray(wsData) && wsData.length > 0) {
                    lines = convertBusLineInfoData(wsData);
                }
                return Promise.resolve(lines);
            }
        })
        // Get station list for all directions(typically there are 2 directions)
        .then(function (lines) {
            if (lines.length === 0) {
                return Promise.resolve(lines);
            }

            return axios.all(lines.map(function (line) {
                return axios.get(BUS_LINE_STATION_LIST_URL, {
                    params: {
                        'id': line.uuid
                    }
                })
                    .then(function (response) {
                        if (response.status !== 200) {  // network exception
                            throw new Error(`Error in calling webservice to get bus line# ${lineNumber} station list. Response ${response.status} : ${response.statusText}`);
                        }
                        else {
                            let wsData = _.get(response, 'data.data');  // Suppose it is an array, check notes.md
                            let stations = [];
                            if (_.isArray(wsData) && wsData.length > 0) {
                                stations = convertStationListData(wsData);
                            }
                            line.stations = stations;  // Merge station list into line data
                            return Promise.resolve(line);
                        }
                    })
            }));
        })
        .then(function (lines) {
            return callback(null, lines);
        })
        .catch(function (error) {
            return callback(error, null);
        });
}

/**
 * Call webservice to get real time bus data for specified lines
 * @param allQueryParams should be an array, each element should follow this structure: {id: <line number>, fromStation: <name of fromStation>}
 * @param callback
 */
function fetchBusRealTimeData(allQueryParams, callback) {
    if (_.isEmpty(allQueryParams)) {
        return callback(null, []);
    }

    axios.all(allQueryParams.map(function (queryParam) {
        return axios.get(BUS_REAL_TIME_STATUS_URL, {
            params: {
                id: queryParam.lineNumber,
                fromStation: queryParam.fromStation
            }
        })
            .then(function (response) {
                if (response.status !== 200) {  // network exception
                    throw new Error(`Error in calling webservice to get watched line ${queryParam.lineNumber}__${queryParam.fromStation} real time data. Response ${response.status} : ${response.statusText}`);
                }
                else {
                    let wsData = _.get(response, 'data.data');  // Suppose it is an array, check notes.md
                    let busStatusForOneLine = [];
                    if (_.isArray(wsData) && wsData.length > 0) {
                        busStatusForOneLine = convertBusStatusListData(wsData);
                    }
                    return Promise.resolve(busStatusForOneLine);
                }
            })
    }))
        .then(function (busStatusList) {
            let searchKeys = allQueryParams.map(function (n) {
                return `${n.lineNumber}__${n.fromStation}`;
            });

            // Reshape the data into k-v form, the k is searchKey, the v is corresponding busStatus
            busStatusList = _.zipObject(searchKeys, busStatusList);

            return callback(null, busStatusList);
        })
        .catch(function (error) {
            return callback(error, null);
        });
}
