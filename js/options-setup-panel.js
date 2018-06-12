/**
 * Js code for bus line setup panel of options page.
 *
 */

let busLineNameField = $('#line-setting-panel-line-input');
let busLineFromStationField = $('#line-setting-panel-from-station-input');

/**
 * Save user input into watched lines, using local storage.
 */
function saveBusLine() {
    let busLineName = busLineNameField.val().toUpperCase();
    let busLineFromStation = busLineFromStationField.val();
    let key = busLineName + '__' + busLineFromStation;

    async.waterfall([
        (callback) => {
            chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
                if (_.isEmpty(object)) {
                    return callback(null, []);
                }
                else {
                    return callback(null, object[KEY_FOR_WATCHED_LINES]);
                }
            });
        },
        // Save into local storage if lineNumber + fromStation is not existed.
        (existingWatchedLines, callback) => {
            console.log('Get existing watchedLines from local storage: ' + JSON.stringify(existingWatchedLines));
            if (!_.some(existingWatchedLines, (item) => {
                _.isEqual(key, item.key)
            })) {
                existingWatchedLines.push(constructWatchedLine(busLineName, busLineFromStation));
                let cache = {};
                cache[KEY_FOR_WATCHED_LINES] = existingWatchedLines;
                chrome.storage.local.set(cache, () => {
                    return callback(null);
                });
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
$('#line-setting-panel-save-btn').on('click', saveBusLine);
