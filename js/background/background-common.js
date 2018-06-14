// Common functions used in background

/**
 * Fetch real time bus data and do checking with user's notify station setting
 */
function checkBusRealTime() {
    async.waterfall([
        function (cb) {
            getAllWatchedLines((err, result) => {
                let lines = (_.isEmpty(result)) ? [] : result;
                return cb(null, lines);
            });
        },
        function (lines, cb) {
            // For debug
            console.log('Latest watched lines are :' + JSON.stringify(lines));

            // TODO             

            return cb(null);
        }
    ], function (err, result) {

    });
}