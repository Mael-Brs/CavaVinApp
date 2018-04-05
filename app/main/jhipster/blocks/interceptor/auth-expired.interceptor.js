(function() {
  'use strict';

  angular
    .module('main')
    .factory('authExpiredInterceptor', authExpiredInterceptor);

  authExpiredInterceptor.$inject = ['$rootScope', '$q', '$injector', '$localStorage', '$sessionStorage'];

  function authExpiredInterceptor($rootScope, $q, $injector, $localStorage, $sessionStorage) {
    const service = {
      responseError: responseError
    };

    return service;

    function responseError(response) {
      if (response.status === 401) {
        delete $localStorage.authenticationToken;
        delete $sessionStorage.authenticationToken;
        const Principal = $injector.get('Principal');
        if (Principal.isAuthenticated()) {
          const Auth = $injector.get('Auth');
          Auth.authorize(true);
        }
      }
      return $q.reject(response);
    }
  }
})();
