/**
 * Build the entire accordion html
 * @param calculatedResults
 * @returns {string}
 */
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
    let active = '';
    if(line.buses.length === 0) {  // expand it if there is at least one bus running.
        active = 'active';
    }

    let html =
        `<div class="${active} title">
                <i class="dropdown icon"></i>
                <a class="ui teal circular large label">${line.lineNumber}路&nbsp;&nbsp;&nbsp;${line.fromStation}&nbsp;->&nbsp;${line.toStation}&nbsp;&nbsp;&nbsp;<i class="bell icon"></i>${line.notifyStation}</a>
                &nbsp;${line.buses.length}辆车
            </div>
            <div class="active content">

                <div class="ui selection divided list">`;

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
    let busIconColor = '';
    let busIconTooltip = '';

    // Set the bus icon color
    if (diffToNotifyStation > NOTIFY_THRESHOLD) {
        busIconColor = 'green';
        busIconTooltip = '巴士还没到达提醒站点';
    }
    else if (diffToNotifyStation <= NOTIFY_THRESHOLD && diffToNotifyStation > 0) {
        busIconColor = 'orange';
        busIconTooltip = '巴士即将到达提醒站点';
    }
    else if (diffToNotifyStation === 0) {
        busIconColor = 'red';
        busIconTooltip = '巴士已到达提醒站点';
    }
    else {
        busIconColor = 'grey';
        busIconTooltip = '巴士已离开提醒站点';
    }

    let html = `<a class="item">
                        <i title="${busIconTooltip}" class="bus icon ${busIconColor}"></i>
                        <div class="content">
                            <div class="header">${bus.busNumber} - ${bus.currentStation}</div>`;

    // The bus is ready to departure
    if(bus.onTheWayStatus === BUS_ON_THE_WAY_STATUS.READY_FOR_DEPARTURE) {
        html += `<div class="description">始发站待发, 距离 <strong>${notifyStation}</strong> 还有 <strong>${diffToNotifyStation}</strong> 个站</div>`;
    }
    // The bus arrived terminal
    else if(bus.onTheWayStatus === BUS_ON_THE_WAY_STATUS.ARRIVED_TERMINAL) {
        html += `<div class="description">已到达终点站</div>`;
    }
    // The bus is on the way
    else {
        if (diffToNotifyStation > 0) {
            html += `<div class="description">距离 <strong>${notifyStation}</strong> 还有 <strong>${diffToNotifyStation}</strong> 个站</div>`;
        }
        else if (diffToNotifyStation === 0) {
            html += `<div class="description">已到达 <strong>${notifyStation}</strong> </div>`;
        }
        else {
            html += `<div class="description">已驶离 <strong>${notifyStation}</strong> </div>`;
        }
    }



    html += `</div></a>`;
    return html;

}