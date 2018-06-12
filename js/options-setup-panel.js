/**
 * Js code for bus line setup panel of options page.
 *
 */

let busLineNameField = $('#line-setup-panel-line-input');
let busLineFromStationField = $('#line-setup-panel-from-station-input');

/**
 * Save user input into watched lines, using local storage.
 */
function saveWatchedLine() {
    let busLineName = busLineNameField.val().trim().toUpperCase();
    let busLineFromStation = busLineFromStationField.val().trim();
    let key = busLineName + '__' + busLineFromStation;

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
        (existingWatchedLines, callback) => {
            console.log('Get existing watchedLines from local storage: ' + JSON.stringify(existingWatchedLines));
            if (!_.some(existingWatchedLines, (item) => _.isEqual(key, item.key))) {
                existingWatchedLines.push(constructWatchedLine(busLineName, busLineFromStation));
                replaceWatchedLines(existingWatchedLines, callback);
            }
            else {
                console.log(`Bus line ${busLineName} + ${busLineFromStation} is already in watched lines!`);
                return callback(null);
            }
        }
    ], (err, result) => {
        if (err) {
            return console.error(`App encounter error: ${err.stack}`);
        }
    });
}

function constructWatchedLine(lineNumber, fromStation) {
    return {
        'lineNumber': lineNumber,
        'fromStation': fromStation,
        'key': lineNumber + '__' + fromStation
    }
}


// Init event handlers
$('#line-setup-panel-save-btn').on('click', saveWatchedLine);