// Common functions used in background

/**
 * Cache for (bus lines and their station list)
 * @type {DataCache}
 */
let busStationListCache = new DataCache(24 * 60 * 60 * 1000);  // TTL = 1 day

/**
 * Fetch station list details for given line#s
 * @param lineNumbers array to contain line#s
 * @param callback
 */
function fetchRelatedBusLines(lineNumbers, callback) {
    let functions = _.map(lineNumbers, fetchBusLineDataWrapped);  // one function for one line#

    async.parallelLimit(functions, 5, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        else {
            // Data structure refer to notes.md
            results = _.flatten(results);

            // For each station, add 'idx' field to indicate its sequence on the line
            _.forEach(results, function (line) {
                if (!_.isEmpty(line.stations)) {
                    for (let i in line.stations) {
                        line.stations[i].idx = _.toInteger(i);
                    }
                }
            });

            let keys = _.map(results, (n) => n.lineNumber + '__' + n.fromStation);
            let stationListForAllBusLines = _.zipObject(keys, results);
            return callback(null, stationListForAllBusLines);
        }
    });
}

function findIndexOfStation(station, stationList) {
    return _.findIndex(stationList, function (o) {
        return o.name === station;
    });
}

/**
 * Fetch real time bus data and do checking with user's notify station setting
 */
function checkBusRealTime() {
    async.waterfall([
        // Get all watched lines from local storage
        function (cb) {
            getAllWatchedLines((err, result) => {
                let lines = (_.isEmpty(result)) ? [] : result;
                return cb(null, lines);
            });
        },
        // Reshape the data to k-v map, the k is searchKey(line#__fromStation),
        // the v is an array contains watched lines with the same searchKey. Check notes.md for sample.
        function (lines, cb) {
            let reshapedLines = _.reduce(lines, function (result, value) {
                (result[value.searchKey] || (result[value.searchKey] = [])).push(value);
                return result;
            }, {});

            // Convert the searchKeys into Objects for further use
            let watchedLineKeys = _.map(_.keys(reshapedLines), function (searchKey) {
                let tokens = searchKey.split('__');
                return {
                    lineNumber: tokens[0],
                    fromStation: tokens[1]
                }
            });

            return cb(null, {
                'watchedLines': reshapedLines,
                'watchedLineKeys': watchedLineKeys
            });
        },
        // Get bus real time status for all watched lines.
        function (result, cb) {
            let watchedLineKeys = result.watchedLineKeys;

            fetchBusRealTimeData(watchedLineKeys, function (err, busStatusList) {
                if (err) {
                    return cb(err, null);
                }
                result.busStatusList = busStatusList;
                return cb(null, result);
            });
        },

        // TODO fetch station list for all related line
        // TODO also need set/get cache

        // Get bus station list for all watched lines.
        function (result, cb) {
            let watchedLineKeys = result.watchedLineKeys;
            let lineNumbers = _.uniq(_.map(watchedLineKeys, (n) => n.lineNumber));  // All line numbers watched
            fetchRelatedBusLines(lineNumbers, function (err, allStationList) {
                if (err) {
                    return cb(err, null);
                }
                result.allStationList = allStationList;
                return cb(null, result);
            });
        },

        // Use above data to do calculation. Typically, calculate the distance between notify station and each running bus
        function (result, cb) {
            let watchedLines = result.watchedLines;
            let busStatusList = result.busStatusList;
            let allStationList = result.allStationList;
            let calculatedResults = {};  // Contains calculated data for each watchedLine & notify station

            _.forOwn(watchedLines, function (notifyStations, searchKey) {  // one watchedLine might has multiple notify stations
                _.forEach(notifyStations, function (notifyStation) {
                    let calculatedObj = _.assign({}, notifyStation);  // Basic fields
                    calculatedResults[notifyStation.key] = calculatedObj;

                    let buses = _.clone(busStatusList[notifyStation.searchKey]);  // the buses running on this line
                    calculatedObj.buses = buses;

                    //calculate each station's distance to notify station
                    let stationList = allStationList[notifyStation.searchKey].stations;
                    let notifyStationIdx = findIndexOfStation(notifyStation.notifyStation, stationList);  // Idx for notify station.
                    calculatedObj.notifyStationIdx = notifyStationIdx;
                    _.forEach(buses, function (bus) {
                        let currentStationIdx = findIndexOfStation(bus.currentStation, stationList);  // Idx for current station.
                        bus.currentStationIdx = currentStationIdx;
                        // Positive number means the bus has not arrived, otherwise already arrived.
                        bus.diffToNotifyStation = notifyStationIdx - currentStationIdx;
                    });
                })
            });
            result.calculatedResults = calculatedResults;
            return cb(null, result);
        },

        // TODO generate the notification messages, include bus at the start station or the terminal station


        function (result, cb) {
            console.log(result);
            return cb(null, result);
        }
    ], function (err, result) {

    });
}