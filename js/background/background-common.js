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
            let keys = _.map(results, (n) => n.lineNumber + '__' + n.fromStation);
            let stationListForAllBusLines = _.zipObject(keys, results);
            return callback(null, stationListForAllBusLines);
        }
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
                'watchLines': reshapedLines,
                'watchedLineKeys': watchedLineKeys
            });
        },
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


        // TODO use bus real time data & line's station list & user watched lines to calculate.
        // TODO might pre-process the station list to add stationIdx(0~n) into each station.
        // The result should contains:
        // (1) How many buses are running on this line now
        // (2) If >= 1 bus running, where is the bus now? (station name + paused/gone)
        // (3) Notification message(s) for user: "车牌号"还有"n"个站就要到达/即将到达/已到达/已到达并刚刚离开. "n" may set to <=5 temporary.
        //     Messages should be grouped by watched line, there may be multiple buses running on the same watched line.
        // The data structure of entire result:
        // {
        //    // Grouped by watched line
        //    "10__下栅检查站__北山村": {
        //       "searchKey":"10__下栅检查站",
        //       "lineNumber":"10",
        //       "fromStation":"下栅检查站",
        //       "toStation":"城轨珠海站",
        //       "notifyStation":"北山村"
        //       "notifyStationIdx": 10  // the index in the station list
        //
        //       // Calculation result, all buses in this line here
        //       "buses": [
        //          {
        //             "busNumber":"粤C00983D",
        //             "currentStation":"唐家",
        //             "currentStationIdx": 7,
        //             "status": 8  // 8 = gone, 5 = docked
        //             // numeric, how many stations between current & notifyStation.
        //             // positive means bus has not arrived, negative means bus gone.
        //             "diffToNotifyStation": 3  // 10 - 7 = 3
        //          },
        //          {/** Another bus **/}
        //       ]
        //    }
        // }


        function (result, cb) {
            console.log(result);
            return cb(null, result);
        }
    ], function (err, result) {

    });
}