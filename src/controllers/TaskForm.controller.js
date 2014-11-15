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