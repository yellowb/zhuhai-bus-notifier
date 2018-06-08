const extensionName = 'ZhuHai Bus Notifier';

// Init logic here when extension installed.
chrome.runtime.onInstalled.addListener(() => {
    console.log(`${extensionName} is installed.`);
    // TODO
    // Might popup notification to remind user to add bus lines

});