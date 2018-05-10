(function() {
  'use strict';

  angular
    .module('main')
    .controller('RegisterController', RegisterController);


  RegisterController.$inject = ['$translate', '$timeout', 'Auth', 'LoginService', '$scope'];

  function RegisterController($translate, $timeout, Auth, LoginService, $scope) {
    const vm = this;

    vm.register = register;

    $scope.$on('$ionicView.enter', function() {
      vm.doNotMatch = null;
      vm.error = null;
      vm.errorUserExists = null;
      vm.login = LoginService.open;
      vm.success = null;
      vm.registerAccount = {};
      vm.confirmPassword = null;
    });

    function register() {
      if (vm.registerAccount.password !== vm.confirmPassword) {
        vm.doNotMatch = 'ERROR';
      } else {
        vm.registerAccount.langKey = $translate.use();
        vm.doNotMatch = null;
        vm.error = null;
        vm.errorUserExists = null;
        vm.errorEmailExists = null;

        Auth.createAccount(vm.registerAccount).then(function() {
          vm.success = 'OK';
        }).catch(function(response) {
          vm.success = null;
          if (response.status === 400 && response.data === 'login already in use') {
            vm.errorUserExists = 'ERROR';
          } else if (response.status === 400 && response.data === 'e-mail address already in use') {
            vm.errorEmailExists = 'ERROR';
          } else {
            vm.error = 'ERROR';
          }
        });
      }
    }
  }
})();
