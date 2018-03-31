(function() {
  'use strict';

  angular
    .module('main')
    .controller('ActivationController', ActivationController);

  ActivationController.$inject = ['$stateParams', 'Auth', 'LoginService'];

  function ActivationController($stateParams, Auth, LoginService) {
    const vm = this;

    Auth.activateAccount({key: $stateParams.key}).then(function() {
      vm.error = null;
      vm.success = 'OK';
    }).catch(function() {
      vm.success = null;
      vm.error = 'ERROR';
    });

    vm.login = LoginService.open;
  }
})();
