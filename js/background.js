


/**
 * Init some data in local storage.
 */
function initStorage() {
    let cache = {};
    cache[KEY_FOR_WATCHED_LINES] = [];
    chrome.storage.local.set(cache);
    console.log(`Local Storage has been initialized.`);
}

// Init logic here when extension installed.
chrome.runtime.onInstalled.addListener(() => {
    console.log(`${APP_NAME} is installed.`);
    // TODO
    initStorage();
});