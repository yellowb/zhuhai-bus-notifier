// Common functions used in background

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
            let result = _.reduce(lines, function (result, value) {
                (result[value.searchKey] || (result[value.searchKey] = [])).push(value);
                return result;
            }, {});
            return cb(null, result);
        },

        // TODO use all searchKeys to call webservice and get bus real time status

        // TODO fetch station list for all related line

        // TODO use bus real time data & line's station list & user watched lines to calculate.
        // The result should contains:
        // (1) How many buses are running on this line now
        // (2) If >= 1 bus running, where is the bus now? (station name + paused/gone)
        // (3) Notification message(s) for user: "车牌号"还有"n"个站就要到达/即将到达/已到达/已到达并刚刚离开. "n" may set to <=5 temporary.



        function (result, cb) {
            console.log(result);
            return cb(null, result);
        }
    ], function (err, result) {

    });
}