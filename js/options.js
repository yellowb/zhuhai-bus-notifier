const KEY_FOR_WATCHED_LINES = 'watchedLines';
const BUS_CURRENT_STATUS_URL = 'http://test.zhbuswx.com/RealTime/GetRealTime'

let busLineNameField = $('#line-setting-panel-line-input');
let busLineFromStationField = $('#line-setting-panel-from-station-input');

/**
 * Save user input into watched lines
 */
function saveBusLine() {
    let busLineName = busLineNameField.val().toUpperCase();
    let busLineFromStation = busLineFromStationField.val();
    let key = busLineName + '__' + busLineFromStation;

    async.waterfall([
        function (callback) {
            chrome.storage.local.get(KEY_FOR_WATCHED_LINES, function (object) {
                if (_.isEmpty(object)) {
                    return callback(null, []);
                }
                else {
                    return callback(null, object[KEY_FOR_WATCHED_LINES]);
                }
            });
        },
        // Save into local storage if not existed.
        function (existingWatchedLines, callback) {
            console.log('Get existing watchedLines from local storage: ' + JSON.stringify(existingWatchedLines));
            if (!_.some(existingWatchedLines, function (item) {
                return _.isEqual(key, item.key);
            })) {
                existingWatchedLines.push(constructWatchedLine(busLineName, busLineFromStation));
                let cache = {};
                cache[KEY_FOR_WATCHED_LINES] = existingWatchedLines;
                chrome.storage.local.set(cache, function () {
                    return callback(null);
                });
            }
            else {
                console.log(`Bus line ${busLineName} + ${busLineFromStation} is already in watched lines!`);
                return callback(null);
            }
        }
    ], function (err, result) {
        // result now equals 'done'
    });
}

function constructWatchedLine(lineNumber, fromStation) {
    return {
        'lineNumber': lineNumber,
        'fromStation': fromStation,
        'key': lineNumber + '__' + fromStation
    }
}


// For message can close
$('#line-setting-panel-save-btn').on('click', saveBusLine);

// For message can close
$('.close.icon').on('click', function () {
    $(this).parent().hide();
});