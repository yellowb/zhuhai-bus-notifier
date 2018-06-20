
// Active accordion
$('.ui.accordion')
    .accordion({
        exclusive: false,
        duration: 250
    })
;

// Settings button
$('#settings-link').on('click', function () {
    window.open(chrome.runtime.getURL('views/options.html'));
});
