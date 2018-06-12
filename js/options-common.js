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
