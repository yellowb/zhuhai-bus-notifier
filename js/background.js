const extensionName = 'ZhuHai Bus Notifier';


/**
 * Init some data in local storage.
 */
function initStorage() {
    chrome.storage.local.set({'watchedLines': []});
    console.log(`Local Storage has been initialized.`);
}

// Init logic here when extension installed.
chrome.runtime.onInstalled.addListener(() => {
    console.log(`${extensionName} is installed.`);
    // TODO
    initStorage();
});