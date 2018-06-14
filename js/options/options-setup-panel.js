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
let userQueryCache = new DataCache(24 * 60 * 60 * 1000);  // TTL = 1 day

function resetUserInput() {
    busLineNumberField.val('');
    busLineNumberField.trigger("keyup");
}

/**
 * Save user input into watched lines, using local storage.
 */
function saveWatchedLine() {
    let busLineNumber = busLineNumberField.val().trim().toUpperCase();
    let busLineFromStation = busLineFromStationField.dropdown('get value').trim();
    let busLineNotifyStation = busLineNotifyStationField.dropdown('get value').trim();

    if (!validateUserInput()) {
        return;
    }

    let key = busLineNumber + '__' + busLineFromStation + '__' + busLineNotifyStation;

    async.waterfall([
        // Need to load all existed watched lines first.
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
                let lines = userQueryCache.get(busLineNumber);
                let line = _.find(lines, {lineNumber: busLineNumber, fromStation: busLineFromStation});
                watchedLines.push(constructWatchedLine(busLineNumber, busLineFromStation, busLineNotifyStation, line.toStation, line.uuid));
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

function constructWatchedLine(lineNumber, fromStation, notifyStation, toStation, lineUuid) {
    return {
        'lineNumber': lineNumber,
        'fromStation': fromStation,
        'notifyStation': notifyStation,
        'toStation': toStation,
        'lineUuid': lineUuid,
        'key': lineNumber + '__' + fromStation + '__' + notifyStation
    }
}

/**
 * when user input bus line number, query webservice and place data into other 2 dropdown lists
 */
function onBusLineNumberFiledChange() {
    let queryLineNumber = busLineNumberField.val().trim().toUpperCase();

    if (_.isEmpty(queryLineNumber)) {
        fillDataToBusLineFromStationField(null);
        return;
    }

    // check cache first
    let lines = userQueryCache.get(queryLineNumber);
    if (!_.isEmpty(lines)) {
        console.log('Load from cache ! ' + queryLineNumber);
        fillDataToBusLineFromStationField(lines);
    }
    else {
        console.log('Load from network ! ' + queryLineNumber);
        // add loading css
        busLineNumberField.parent().addClass('loading');

        fetchBusLineData(queryLineNumber, function (err, lines) {

            // put into cache
            if (!_.isEmpty(lines)) {
                console.log('Put into cache ! ' + queryLineNumber);
                userQueryCache.put(queryLineNumber, lines);
            }

            // fill data into 'from station' dropdown list
            fillDataToBusLineFromStationField(lines);

            // remove loading css
            busLineNumberField.parent().removeClass('loading');
        });
    }
}

/**
 * Format and fill data into FromStation dropdown list
 * @param lines
 */
function fillDataToBusLineFromStationField(lines) {
    // clear selection
    busLineFromStationField.dropdown('clear');

    // If line# not found, remove all existed items
    if (!_.isArray(lines) || _.isEmpty(lines)) {
        busLineFromStationField.dropdown('setup menu', {
            values: []
        });
    }
    // If line# found, replace all existed items by new ones.
    else {
        let items = _.map(lines, function (n) {
            return {
                name: n['fromStation'],
                value: n['fromStation']
            }
        });
        busLineFromStationField.dropdown('setup menu', {
            values: items
        });
        // Auto select the 1st item.
        busLineFromStationField.dropdown('set selected', [items[0].value]);
    }
    busLineFromStationField.dropdown('refresh');
}

/**
 * Format and fill data into NotifyStation dropdown list
 * @param stations
 */
function fillDataToBusLineNotifyStationField(stations) {
    // clear selection
    busLineNotifyStationField.dropdown('clear');

    // If line# not found, remove all existed items
    if (!_.isArray(stations) || _.isEmpty(stations)) {
        busLineNotifyStationField.dropdown('setup menu', {
            values: []
        });
    }
    // If line# found, replace all existed items by new ones.
    else {
        let items = _.map(stations, function (n) {
            return {
                name: n['name'],
                value: n['name']
            }
        });
        busLineNotifyStationField.dropdown('setup menu', {
            values: items
        });
        // Auto select the 1st item.
        busLineNotifyStationField.dropdown('set selected', [items[0].value]);
    }
    busLineNotifyStationField.dropdown('refresh');
}



/**
 * When the selected value in FromStation Dropdown changes, the NotifyStation dropdown should be filled with correct data.
 * @param value
 */
function onBusLineFromStationDropdownChange(value) {
    // if user input is empty or no bus line can be found
    if (_.isEmpty(value)) {
        fillDataToBusLineNotifyStationField(null);
        return;
    }

    let queryLineNumber = busLineNumberField.val().trim().toUpperCase();
    let lines = userQueryCache.get(queryLineNumber);
    if (_.isEmpty(lines)) {  // should not go here!
        fillDataToBusLineNotifyStationField(null);
    }
    else {  // get station list from cache and fill into dropdown list.
        let line = _.find(lines, {lineNumber: queryLineNumber, fromStation: value});
        fillDataToBusLineNotifyStationField(line.stations);
    }
}

/**
 * Return true if user input passes validation
 * @returns {boolean}
 */
function validateUserInput() {
    let busLineNumber = busLineNumberField.val().trim().toUpperCase();
    let busLineFromStation = busLineFromStationField.dropdown('get value').trim();
    let busLineNotifyStation = busLineNotifyStationField.dropdown('get value').trim();

    let errors = [];

    if (_.isEmpty(busLineNumber)) {
        errors.push(`<li>巴士路线不能为空</li>`);
    }
    if (_.isEmpty(busLineFromStation)) {
        errors.push(`<li>起始站点不能为空</li>`);
    }
    if (_.isEmpty(busLineNotifyStation)) {
        errors.push(`<li>提醒站点不能为空</li>`);
    }

    showErrorMessages(errors);
    return errors.length === 0;
}

function showErrorMessages(errMsgs) {
    if (_.isEmpty(errMsgs)) {
        $('#line-setup-panel-error-message').hide();
    }
    else {
        $('#line-setup-panel-error-message-list').empty();
        $('#line-setup-panel-error-message-list').append(errMsgs);
        $('#line-setup-panel-error-message').show();
    }
}

// Init event handlers
$(function () {
    busLineNumberField = $('#line-setup-panel-line-input');
    busLineFromStationField = $('#line-setup-panel-from-station-input');
    busLineNotifyStationField = $('#line-setup-panel-notify-station-input');

    // Save button
    $('#line-setup-panel-save-btn').on('click', saveWatchedLine);
    $('#line-setup-panel-reset-btn').on('click', resetUserInput);

    // Active dropdown lists
    busLineFromStationField.dropdown({
        forceSelection: true,
        onChange: onBusLineFromStationDropdownChange
    });
    busLineNotifyStationField.dropdown();

    // Input events for bus line field.
    busLineNumberField.on('keyup', _.throttle(onBusLineNumberFiledChange, 1000));
    busLineNumberField.on('paste', function () {
        setTimeout(onBusLineNumberFiledChange, 0);
    })
});
