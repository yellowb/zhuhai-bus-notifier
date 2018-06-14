/**
 * Init an empty watched line list in local storage.
 */
function initStorage() {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, function (result) {
        // Check if the extension is just installed.
        if (_.isEmpty(result)) {
            let cache = {};
            cache[KEY_FOR_WATCHED_LINES] = [];
            chrome.storage.local.set(cache);
            console.log(`Watched line list has been initialized in local storage.`);
        }
        else {
            console.log(`Watched line list was found in local storage, no need to re-initialize.`);
        }
    });
}

// Init logic here when extension installed. Or when the extension is updated to a new version,
// and when Chrome is updated to a new version.
chrome.runtime.onInstalled.addListener(() => {
    console.log(`${APP_NAME} is installed.`);
    initStorage();
});

// Set persistence <- true in manifest.json to ensure it keeps running in background.
setInterval(function () {
    // TODO trigger bus real time checking

}, INTERVAL_OF_CHECK_BUS);
