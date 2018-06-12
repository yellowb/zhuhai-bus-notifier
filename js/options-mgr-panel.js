/**
 * Js code for bus line mgr panel of options page.
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