const APP_NAME = 'ZhuHai Bus Notifier';

const KEY_FOR_WATCHED_LINES = 'watchedLines';

/**
 * Interval of checking bus real time data
 * @type {number}
 */
const INTERVAL_OF_CHECK_BUS = 30 * 1000;

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

/**
 * The status of a running bus.(the numbers are the same as what webservice returned)
 * @type {{DOCKED: string, GONE: string}}
 */
const BUS_ACTIVITY_STATUS = {
    DOCKED: '5',  // Docked at a station
    GONE: '8' // Departure from a station but not yet arrive next station
};

/**
 * The status of a bus on a line
 * @type {{READY_FOR_DEPARTURE: string, ON_THE_WAY: string, ARRIVED_TERMINAL: string}}
 */
const BUS_ON_THE_WAY_STATUS = {
    READY_FOR_DEPARTURE: 'READY_FOR_DEPARTURE',  // The bus is ready to kick-off
    ON_THE_WAY: 'ON_THE_WAY',  // The bus is running on its line
    ARRIVED_TERMINAL: 'ARRIVED_TERMINAL',  // The bus has arrived the terminal
};

/**
 * The threshold which how many stations remaining that system should start to notify user
 * @type {number}
 */
const NOTIFY_THRESHOLD = 3;
