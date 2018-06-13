/**
 * Js code for bus line setup panel of options page.
 *
 */

let busLineNameField = $('#line-setup-panel-line-input');
let busLineFromStationField = $('#line-setup-panel-from-station-input');
let busLineNotifyStationField = $('#line-setup-panel-notify-station-input');

/**
 * Save user input into watched lines, using local storage.
 */
function saveWatchedLine() {
    let busLineName = busLineNameField.val().trim().toUpperCase();
    let busLineFromStation = busLineFromStationField.val().trim();
    let busLineNotifyStation = busLineNotifyStationField.val().trim();
    let key = busLineName + '__' + busLineFromStation + '__' + busLineNotifyStation;

    async.waterfall([
        (callback) => {
            getAllWatchedLines((result) => {
                if (_.isEmpty(result)) {
                    return callback(null, []);
                }
                else {
                    return callback(null, result);
                }
            });
        },
        // Save into local storage if lineNumber + fromStation is not existed.
        (watchedLines, callback) => {
            if (!_.some(watchedLines, (item) => _.isEqual(key, item.key))) {
                watchedLines.push(constructWatchedLine(busLineName, busLineFromStation, busLineNotifyStation));
                replaceWatchedLines(watchedLines, callback);
            }
            else {
                console.log(`Bus line ${key} is already in watched lines!`);
                return callback(null);
            }
        }
    ], (err, result) => {
        if (err) {
            return console.error(`App encounter error: ${err.stack}`);
        }
    });
}

function constructWatchedLine(lineNumber, fromStation, notifyStation, toStation, lineId) {
    return {
        'lineNumber': lineNumber,
        'fromStation': fromStation,
        'notifyStation': notifyStation,
        'toStation': toStation,
        'lineId': lineId,
        'key': lineNumber + '__' + fromStation + '__' + notifyStation
    }
}


// Init event handlers
$(function () {
    $('#line-setup-panel-save-btn').on('click', saveWatchedLine);
});
