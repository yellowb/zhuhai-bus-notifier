/**
 * Js code for bus line mgr panel of options page.
 *
 */


/**
 * Return a html block for bus line label
 * @param lineNumber
 * @param fromStation
 * @param notifyStation
 * @param toStation
 * @param key
 * @returns {string}
 */
function labelTemplate(lineNumber, fromStation, notifyStation, toStation, key) {
    return `
  <div id="${key}" class="item">
    <a class="ui teal large label">
        <i class="bus icon"></i>
        ${lineNumber}
        <div class="detail">${fromStation} <i class="angle double right icon"></i> ${toStation}</div>
        <div class="detail"><i class="bell icon"></i>${notifyStation}</div>
        <i class="delete icon"></i>
    </a>
  </div>
`;
}

/**
 * Generate the html blocks for bus line labels
 * @param watchedLines
 */
function generateHtmlForLabels(watchedLines) {
    let html = '';
    _.forEach(watchedLines, (line) => {
        html += labelTemplate(line.lineNumber, line.fromStation, line.notifyStation, line.toStation, line.key);
    });
    return html;
}

/**
 * Refresh the whole bus line labels area using latest data.
 */
function refreshWatchedLineLabels(callback) {
    async.waterfall([
        (cb) => {
            getAllWatchedLines((result) => {
                if (_.isEmpty(result)) {
                    return cb(null, []);
                }
                else {
                    return cb(null, result);
                }
            });
        },
        (watchedLines, cb) => {

            // For debug
            console.log('Latest watched lines are :' + JSON.stringify(watchedLines));

            let html = generateHtmlForLabels(watchedLines);
            $('#line-mgr-panel-line-labels').html(html);
            return cb(null);
        }
    ], (err) => {
        if (err) {
            console.error(`App encounter error: ${err.stack}`);
        }
        if (_.isFunction(callback)) {
            return callback(err, null);
        }
    });
}

/**
 * Remove the watched line label and its data in local storage.
 * @param label
 */
function removeWatchedLineLabel(label) {
    removeWatchedLine(label.id, (err) => {
        if (!err) {
            // Remove from UI
            label.remove();
        }
    })
}

// Init data and event listeners when open options page.
$(function () {
    async.waterfall([
        (cb) => {
            // Add event listener for deleting lines
            $('#line-mgr-panel-line-labels').on('click', '.delete.icon', function () {
                let label = $(this).parent().parent()[0];
                removeWatchedLineLabel(label);
            });
            cb();
        }
    ], (err) => {
        if (err) {
            console.error(`App encounter error: ${err.stack}`);
        }
    });
});

