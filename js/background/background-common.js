// Common functions used in background

/**
 * Fetch real time bus data and do checking with user's notify station setting
 */
function checkBusRealTime() {
    async.waterfall([
        // Get all watched lines
        function (cb) {
            getAllWatchedLines((err, result) => {
                let lines = (_.isEmpty(result)) ? [] : result;
                return cb(null, lines);
            });
        },
        // Reshape the data to k-v map, the k is line#, the v is an array contains watched lines with the same line#
        function (lines, cb) {
            // For debug
            // console.log('Latest watched lines are :' + JSON.stringify(lines));

            // TODO

            let result = _.reduce(lines, function (result, value) {
                (result[value.searchKey] || (result[value.searchKey] = [])).push(value);return result;
            }, {});

            return cb(null, result);
        },
        function (result, cb) {
            console.log(result);
            return cb(null, result);
        }
    ], function (err, result) {

    });
}