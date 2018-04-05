'use strict';
(function() {
  angular
    .module('main')
    .factory('LoginService', LoginService);

  LoginService.$inject = ['$state'];

  function LoginService($state) {

    const service = {
      open: open
    };

    return service;

    function open() {
      $state.go('login');
    }
  }
})();
