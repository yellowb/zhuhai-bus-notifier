function entireAccordionTemplate(calculatedResults) {
    let html = ``;
    _.forOwn(calculatedResults, function (line) {
        html += accordionItemTemplate(line);
    });
    return html;
}


/**
 * Build a html block for one accordion
 * @param line
 * @returns {string}
 */
function accordionItemTemplate(line) {
    let html =
        `<div class="active title">
                <i class="dropdown icon"></i>
                <a class="ui teal circular large label">${line.lineNumber}&nbsp;&nbsp;&nbsp;${line.fromStation}&nbsp;->&nbsp;${line.toStation}&nbsp;&nbsp;&nbsp;<i class="bell icon"></i>${line.notifyStation}</a>
                &nbsp;${line.buses.length}辆车
            </div>
            <div class="active content">

                <div class="ui selection divided list">`;

    if(line.buses.length === 0) {
        html = html.replace('active', '');
    }

    _.forEach(line.buses, function (bus) {
        html += busItemTemplate(bus, line.notifyStation);
    });

    html += `</div>
            </div>`;

    return html;
}


/**
 * Build a html block for one bus
 * @param bus
 * @param notifyStation
 * @returns {string}
 */
function busItemTemplate(bus, notifyStation) {

    let diffToNotifyStation = bus.diffToNotifyStation;

    let html = `<a class="item">
                        <i class="bus icon orange"></i>
                        <div class="content">
                            <div class="header">${bus.busNumber} - ${bus.currentStation}</div>`;

    //TODO 结合 ON_THE_WAY 提示更多信息

    if (diffToNotifyStation > 0) {
        html += `<div class="description">距离 <strong>${notifyStation}</strong> 还有 <strong>${diffToNotifyStation}</strong> 个站</div>`;
    }
    else if (diffToNotifyStation === 0) {
        html += `<div class="description">已到达 <strong>${notifyStation}</strong> </div>`;
    }
    else {
        html += `<div class="description">已驶离 <strong>${notifyStation}</strong> </div>`;
    }

    html += `</div></a>`;
    return html;

}