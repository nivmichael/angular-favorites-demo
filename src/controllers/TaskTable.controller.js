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