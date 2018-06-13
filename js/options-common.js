/**
 * Common functions in options page
 *
 */


/**
 * Remove all watched bus lines from local storage
 * @param callback
 */
function clearWatchedLines(callback) {
    chrome.storage.local.clear(callback);
    updateCountLabel(0);
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
        updateCountLabel(watchedLines.length);
        return callback(null);
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
            _.remove(watchedLines, function (item) {
                return item.key === key;
            });
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
 * Update the count label on the left menu to latest data.
 * @param count
 */
function updateCountLabel(count) {
    $('#line-mgr-count').text(count);
    if (count > 0) {
        $('#line-mgr-count').addClass('green');
    }
    else {
        $('#line-mgr-count').removeClass('green')
    }
}

/**
 * Init some UI elements when open Options page.
 */
(function initUi() {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
        updateCountLabel(_.isEmpty(object) ? 0 : object[KEY_FOR_WATCHED_LINES].length);
    });

    // For message can be closed.
    $('.close.icon').on('click', function () {
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
})();
