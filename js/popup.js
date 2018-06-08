const f1 = function() {
    chrome.extension.getBackgroundPage().console.log('click button, ' + new Date());
};

document.getElementById('changeValue').onclick = f1;