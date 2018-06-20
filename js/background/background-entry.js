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
    initFlags();
});

function initFlags() {
    chrome.storage.local.get(KEY_FOR_FLAGS, function (result) {
        // Check if the extension is just installed.
        if (_.isEmpty(result)) {
            setFlags(true, true, true);
            console.log(`No flags found in local storage. All set to true.`);
        }
        else {
            let flags = result[KEY_FOR_FLAGS];
            setFlags(flags.executionFlag, flags.alarmFlag, false);
            console.log(`Flags found in local storage: ${JSON.stringify(result)}`);
        }
    });
}



// Set persistence <- true in manifest.json to ensure it keeps running in background.
setInterval(function () {
    if(!executionFlag) {
        console.log(`executionFlag is false. No need to execute.`);
        return;
    }
    // trigger bus real time checking
    checkBusRealTime();
}, INTERVAL_OF_CHECK_BUS);

// Listener for popup.js
chrome.extension.onConnect.addListener(function(port) {
    console.log('[Popup.js] connected.');
    port.onMessage.addListener(function(msg) {
        console.log(`[Popup.js] received msg: ${msg}`);
        port.postMessage(handlePopupRequest(msg));
    });
});








// let opt = {
//     iconUrl: chrome.extension.getURL("images/icon128.png"),
//     type: 'list',
//     title: 'Primary Title'+ (counter++),
//     message: 'Primary message to display',
//     priority: 1,
//     items: [{ title: 'Item1', message: 'This is item 1.'},
//         { title: 'Item2', message: 'This is item 2.'},
//         { title: 'Item3', message: 'This is item 3.'}]
// };
// chrome.notifications.create('notify' , opt, function() { console.log('created!'); });
//
//
// yourSound.play();