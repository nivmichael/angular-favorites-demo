(function () {
    /**
     * define the app module
     * more configuration will be added at later time
     */
    angular.module('TaskManager', []);
}());

(function () {
    /**
     * save and retrieve data from local storage
     * @param $window
     * @constructor
     */
    function StorageService($window) {

        /**
         * save data by key to a data storage
         * @param key
         * @param data
         */
        this.saveData = function (key, data) {
            $window.localStorage.setItem(key, JSON.stringify(data));
        };

        /**
         * return data from storage by a given key
         * @param key
         * @returns {*}
         */
        this.loadData = function (key) {
            return JSON.parse($window.localStorage.getItem(key));
        };

        /**
         * remove an item from data storage by key
         * @param key
         */
        this.removeData = function (key) {
            $window.localStorage.removeItem(key)
        };
    }

    angular.module('TaskManager')
        .service('StorageService',['$window', StorageService])
}());

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
(function () {
    /**
     * manage general app functions
     * @param scope
     * @constructor
     */
    function TaskActionBarController(scope) {

        this.toggleCompletedTask = function () {
            scope.taskAppState.hideCompleted = !scope.taskAppState.hideCompleted;
        };

        this.clearLog = function () {
            scope.$emit('TaskAppEvent','LogEvent:clearLog');
        };
    }

    angular.module('TaskManager')
        .controller('TaskActionBarController',['$scope', TaskActionBarController])
}());
(function () {

    /**
     * manage a task form functions
     * @param scope
     * @param StorageService
     * @constructor
     */
    function TaskFormController(scope, StorageService) {

        /**
         * hold task priorities for the view
         * @type {string[]}
         */
        this.taskPriorities = ['High', 'Normal', 'Low'];

        /**
         * add or update a task in the taskAppState array and emit events
         * @param task
         */
        this.addTask = function (task) {
            if (scope.taskAppState.taskList.indexOf(task) == -1) {
                scope.taskAppState.taskList.push({
                    title: task.title,
                    description: task.description,
                    completed: false,
                    priority: task.priority
                });
                scope.$emit('TaskAppEvent', 'LogEvent:userAction', 'New Task Added!');
            } else {
                scope.$emit('TaskAppEvent', 'LogEvent:userAction', 'Task has been updated');
            }

            scope.taskAppState.activeTask = {};
            StorageService.saveData('taskList', scope.taskAppState.taskList);
        };


        //todo: it`s not belong here
        scope.$on('LogEvent:userAction', function (evt, type) {
            if(type == 'Task been removed') {
                StorageService.saveData('taskList', scope.taskAppState.taskList);
            }
        });
    }

    angular.module('TaskManager')
        .controller('TaskFormController', ['$scope','StorageService', TaskFormController])

}());
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
        .controller('TaskLogController', TaskLogController);
}());
(function () {
    /**
     * manage the parent scope.
     * @param scope
     * @param StorageService
     * @constructor
     */
    function TaskManagerAppController(scope, StorageService) {

        //todo: use a service to manage app state
        scope.taskAppState = {
            taskList : StorageService.loadData('taskList') || [],
            activeTask: {},
            hideCompleted: false,
            showActionBar: true
        };

        scope.$on('TaskAppEvent', function (event, type, data) {
            scope.$broadcast(type, data);
        });

        this.toggleActionBar = function () {
            scope.taskAppState.showActionBar = !scope.taskAppState.showActionBar;
        }
    }

    angular.module('TaskManager')
        .controller('TaskManagerAppController', ['$scope','StorageService', TaskManagerAppController])
}());
(function () {
    /**
     * manage the task table
     * @param scope
     * @constructor
     */
    function TaskTableController(scope) {

        this.removeTask = function (task) {
            scope.taskAppState.taskList.splice(scope.taskAppState.taskList.indexOf(task), 1);
            scope.$emit('TaskAppEvent','LogEvent:userAction','Task been removed')
        };

        this.editTask = function (task) {
            scope.taskAppState.activeTask =
                    scope.taskAppState.taskList[scope.taskAppState.taskList.indexOf(task)];
        };
    }

    angular.module('TaskManager')
        .controller('TaskTableController', ['$scope',TaskTableController]);

}());
(function () {

    function TruncateFilter() {
        return function (input, limit) {

            if (limit <= 0) {
                return '';
            }

            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > limit) {
                    input = inputWords.slice(0, limit).join(' ') + '...';
                }
            }
            return input;
        }
    }

    angular.module('TaskManager')
        .filter('truncate', TruncateFilter)
}());
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