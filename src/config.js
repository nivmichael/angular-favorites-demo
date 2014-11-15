(function () {
    /**
     * configuration block for the TaskManager app
     * @param LogManagerProvider
     * @constructor
     */
    function TaskManagerConfig (LogManagerProvider) {
        LogManagerProvider.enableConsole(false);
    }

    angular.module('TaskManager')
        .config([ 'LogManagerProvider' , TaskManagerConfig ])
}());