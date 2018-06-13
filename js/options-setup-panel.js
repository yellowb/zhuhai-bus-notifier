/**
 * Js code for bus line setup panel of options page.
 *
 */

let busLineNumberField = null;
let busLineFromStationField = null;
let busLineNotifyStationField = null;

/**
 * Cache search result (bus lines and their station list)
 * @type {DataCache}
 */
let cache = new DataCache(24 * 60 * 60 * 1000);  // TTL = 1 day

/**
 * Save user input into watched lines, using local storage.
 */
function saveWatchedLine() {
    let busLineNumber = busLineNumberField.val().trim().toUpperCase();
    let busLineFromStation = busLineFromStationField.dropdown('get value').trim();
    let busLineNotifyStation = busLineNotifyStationField.dropdown('get value').trim();
    let key = busLineNumber + '__' + busLineFromStation + '__' + busLineNotifyStation;

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
                watchedLines.push(constructWatchedLine(busLineNumber, busLineFromStation, busLineNotifyStation));
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

/**
 * when user input bus line number, query webservice and place data into other 2 dropdown lists
 */
function onBusLineNumberFiledChange() {
    let busLineNumber = busLineNumberField.val().trim().toUpperCase();
    console.log(busLineNumber);

    if(_.isEmpty(busLineNumber)) {
        return;
    }

    axios.get(BUS_LINE_INFO_URL, {
        params: {
            'handlerName': 'GetLineListByLineName',
            'key': busLineNumber
        }
    })
        .then(function (response) {
            console.log(response.status);
            console.log(response.data);

            if (response.status !== 200) {  // network exception
                throw new Error(`${response.status} : ${response.statusText}`);
            }
            else {
                let lines = response.data.data;
                if(_.isEmpty(lines)) {
                    lines = [];
                    // TODO need more logic
                }

            }
            return Promise.resolve(12345);
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Init event handlers
$(function () {
    busLineNumberField = $('#line-setup-panel-line-input');
    busLineFromStationField = $('#line-setup-panel-from-station-input');
    busLineNotifyStationField = $('#line-setup-panel-notify-station-input');

    $('#line-setup-panel-save-btn').on('click', saveWatchedLine);

    // Active dropdown lists
    busLineFromStationField.dropdown();
    busLineNotifyStationField.dropdown();

    busLineNumberField.on('keyup', _.throttle(onBusLineNumberFiledChange, 1000));
    busLineNumberField.on('paste', function () {
        setTimeout(onBusLineNumberFiledChange, 0);
    })
});
