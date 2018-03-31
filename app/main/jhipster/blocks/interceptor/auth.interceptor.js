(function() {
  'use strict';

  angular
    .module('main')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$rootScope', '$q', '$location', '$localStorage', '$sessionStorage'];

  function authInterceptor($rootScope, $q, $location, $localStorage, $sessionStorage) {
    const service = {
      request: request
    };

    return service;

    function request(config) {
      /*jshint camelcase: false */
      config.headers = config.headers || {};
      const token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
})();
