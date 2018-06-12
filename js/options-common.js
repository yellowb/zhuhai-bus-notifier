// For message can be closed.
$('.close.icon').on('click', function () {
    $(this).parent().hide();
});

// Active item when clicking menu
$('.ui.menu.vertical').on('click', '.item', function () {
    if (!$(this).hasClass('dropdown')) {
        // Active this item and de-active others
        $(this).addClass('active').siblings('.item').removeClass('active');

        // Show this panel and hide others
        $('#' + this.id + '-panel').show().siblings('div').hide();
    }
});

function updateCountLabel(count) {
    $('#line-mgr-count').text(count);
    if (count > 0) {
        $('#line-mgr-count').addClass('green');
    }
    else {
        $('#line-mgr-count').removeClass('green')
    }
}

/**
 * Init some UI elements when open Options page.
 */
function initUi() {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
        updateCountLabel(_.isEmpty(object) ? 0 : object[KEY_FOR_WATCHED_LINES].length);
    });
}

initUi();