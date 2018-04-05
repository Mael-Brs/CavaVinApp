(function() {
  'use strict';

  angular
    .module('main')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['Principal', 'Auth', '$ionicHistory', 'JhiLanguageService', '$translate'];

  function SettingsController(Principal, Auth, $ionicHistory, JhiLanguageService, $translate) {
    const vm = this;

    vm.error = null;
    vm.save = save;
    vm.settingsAccount = null;
    vm.success = null;

    /**
         * Store the "settings account" in a separate variable, and not in the shared "account" variable.
         */
    const copyAccount = function(account) {
      return {
        activated: account.activated,
        email: account.email,
        firstName: account.firstName,
        langKey: account.langKey,
        lastName: account.lastName,
        login: account.login
      };
    };

    Principal.identity().then(function(account) {
      vm.settingsAccount = copyAccount(account);
    });

    function save() {
      Auth.updateAccount(vm.settingsAccount).then(function() {
        vm.error = null;
        vm.success = 'OK';
        Principal.identity(true).then(function(account) {
          vm.settingsAccount = copyAccount(account);
        });
        JhiLanguageService.getCurrent().then(function(current) {
          if (vm.settingsAccount.langKey !== current) {
            $translate.use(vm.settingsAccount.langKey);
            $ionicHistory.clearCache();
          }
        });
      }).catch(function() {
        vm.success = null;
        vm.error = 'ERROR';
      });
    }
  }
})();
