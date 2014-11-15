(function () {
    /**
     * expose some log methods and manage a local event log array
     * @param $scope
     * @param LogManager
     * @constructor
     */
    function TaskLogController($scope, LogManager) {

        /**
         * returns the eventslog array from service
         * @returns {*|Array|*}
         */
        this.eventsLog = function () {
            return LogManager.loadTaskEventLog();
        };

        /**
         * log new event to the eventlog array
         * @param event
         * @param type
         */
        this.logTaskEvent = function (event, type) {
            LogManager.logTaskEvent(event, type);
        };

        /**
         * delete the logs from storage
         */
        this.clearLog = function () {
            LogManager.clearLog('TaskEventLog')
        };

        $scope.$on('LogEvent:userAction', this.logTaskEvent);
        $scope.$on('LogEvent:clearLog', this.clearLog);
    }

    angular.module('TaskManager')
        .controller('TaskLogController', ['$scope', 'LogManager', TaskLogController]);
}());