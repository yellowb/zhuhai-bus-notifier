
var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.onMessage.addListener(function (msg) {
    console.log(`[Background.js] received msg: ${msg}`);
    $('#content').html(msg);
});

const f1 = function () {
    port.postMessage("Hi BackGround");
};

document.getElementById('changeValue').onclick = f1;