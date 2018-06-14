/**
 * Common functions in options page
 *
 */


/**
 * Remove all watched bus lines from local storage
 * @param callback
 */
function clearWatchedLines(callback) {
    let cache = {};
    cache[KEY_FOR_WATCHED_LINES] = null;
    chrome.storage.local.set(cache, () => {
        notifyWatchedLineChanges(0);
        if (_.isFunction(callback)) {
            return callback(null);
        }
    });
}

/**
 * Get all watched bus lines from local storage
 * @param callback
 */
function getAllWatchedLines(callback) {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
        callback.call(this, object[KEY_FOR_WATCHED_LINES]);
    });
}

/**
 * Replace existing bus lines in local storage
 * @param watchedLines
 * @param callback
 */
function replaceWatchedLines(watchedLines, callback) {
    let cache = {};
    cache[KEY_FOR_WATCHED_LINES] = watchedLines;
    chrome.storage.local.set(cache, () => {
        notifyWatchedLineChanges(watchedLines.length);
        return callback(null, 1);
    });
}

/**
 * Remove one watched line from local storage by key
 * @param key
 * @param callback
 */
function removeWatchedLine(key, callback) {
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
            _.remove(watchedLines, (line) => line.key === key);
            replaceWatchedLines(watchedLines, cb);
        }
    ], (err) => {
        if (err) {
            console.error(`App encounter error: ${err.stack}`);
        }
        return callback(err, null);
    });
}

/**
 * Update the UI subjected to latest data.
 * @param count
 */
function notifyWatchedLineChanges(count) {
    // Update the count label
    $('#line-mgr-count').text(count);
    if (count > 0) {
        $('#line-mgr-count').addClass('green');
    }
    else {
        $('#line-mgr-count').removeClass('green')
    }

    // Update mgr panel labels
    refreshWatchedLineLabels();
}

/**
 * Init some UI elements when open Options page.
 */
$(function () {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
        notifyWatchedLineChanges(_.isEmpty(object) ? 0 : object[KEY_FOR_WATCHED_LINES].length);
    });

    // For message can be closed.
    $('.message').on('click', '.close.icon', function () {
        $(this).parent().hide();
    });

    // Active item when clicking menu
    $('.ui.menu.vertical').on('click', '.item', function () {
        if (!$(this).hasClass('dropdown')) {
            // Active this item and de-active others
            $(this).addClass('active').siblings('.item').removeClass('active');

            // Show this panel and hide others
            $('#' + this.id + '-panel').show().siblings('div').hide();
        }
    });
});
