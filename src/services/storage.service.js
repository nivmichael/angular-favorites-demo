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
