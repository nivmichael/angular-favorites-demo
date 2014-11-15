(function () {
    /**
     * manage an array of logs
     * @constructor
     */
    function LogManager() {

        var printToConsole = false;

        /**
         * toggle printing to console
         * @param flag
         */
        this.enableConsole = function (flag) {
            printToConsole = flag;
        };

        /**
         * return an instance of the log manager service
         * @param StorageService
         * @returns {{TaskEventLog: Array, loadTaskEventLog: loadTaskEventLog, logTaskEvent: logTaskEvent}}
         */
        this.$get = function (StorageService) {

            return {

                TaskEventLog: [],

                /**
                 * clear the logs from data storage
                 * @param key
                 */
                clearLog : function (key) {
                    StorageService.removeData(key);
                    this.TaskEventLog = [];
                },

                /**
                 * load tasks from data storage
                 * @returns {*|Array}
                 */
                loadTaskEventLog: function () {
                    return this.TaskEventLog = StorageService.loadData('TaskEventLog') || [];
                },

                /**
                 * add a new event to the events array and save it to data storage
                 * @param event
                 * @param type
                 */
                logTaskEvent: function (event, type) {

                    var eventLog = {
                        timeStamp: new Date(),
                        logMsg: type
                    };

                    this.TaskEventLog.push(eventLog);

                    if(printToConsole) {
                        console.log(eventLog.logMsg + "at: " + eventLog.timeStamp);
                    }

                    StorageService.removeData('TaskEventLog');
                    StorageService.saveData('TaskEventLog', this.TaskEventLog);
                }
            }
        };
    }

    angular.module('TaskManager')
        .provider('LogManager',LogManager)
}());