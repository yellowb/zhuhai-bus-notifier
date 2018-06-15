const APP_NAME = 'ZhuHai Bus Notifier';

const KEY_FOR_WATCHED_LINES = 'watchedLines';

/**
 * Interval of checking bus real time data
 * @type {number}
 */
const INTERVAL_OF_CHECK_BUS = 10 * 1000;

/**
 * URL to get bus real time status
 * @type {string}
 */
const BUS_REAL_TIME_STATUS_URL = 'http://test.zhbuswx.com/RealTime/GetRealTime';

/**
 * URL to get basic line info for one bus line#
 * @type {string}
 */
const BUS_LINE_INFO_URL = 'http://test.zhbuswx.com/Handlers/BusQuery.ashx';

/**
 * Get station list for one bus line
 * @type {string}
 */
const BUS_LINE_STATION_LIST_URL = 'http://test.zhbuswx.com/StationList/GetStationList';

const BUS_STATUS = {
    DOCKED: '5',
    GONE: '8'
};
