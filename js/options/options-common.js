/**
 * Common functions in options page
 *
 */


/**
 * Update the UI subjected to latest data.
 * @param count
 */
function notifyWatchedLineChanges(count) {
    // Update the count label
    $('#line-mgr-count').text(count);
    if (count > 0) {
        $('#line-mgr-count').addClass('green');
    }
    else {
        $('#line-mgr-count').removeClass('green')
    }

    // Update mgr panel labels
    refreshWatchedLineLabels();
}

/**
 * Init some UI elements when open Options page.
 */
$(function () {
    chrome.storage.local.get(KEY_FOR_WATCHED_LINES, (object) => {
        notifyWatchedLineChanges(_.isEmpty(object) ? 0 : object[KEY_FOR_WATCHED_LINES].length);
    });

    // For message can be closed.
    $('.message').on('click', '.close.icon', function () {
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
});
