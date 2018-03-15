'use strict';
(function() {
  angular
    .module('main')
    .factory('CacheService', ['$cacheFactory', function($cacheFactory) {
      return $cacheFactory('myCache');
    }]);
})();
