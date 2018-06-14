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
            return callback(null, null);
        }
    });
}

/**
 * Get all watched bus lines from local storage
 * @param callback
 */
function getAllWatchedLines(callback) {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
        callback.call(this, null, object[KEY_FOR_WATCHED_LINES]);
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
            getAllWatchedLines((err, result) => {
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