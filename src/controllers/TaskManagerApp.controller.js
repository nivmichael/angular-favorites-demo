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