(function() {

  angular.module('main')
    .controller('MenuCtrl', function($log, Auth, $state, Principal, LoginService, CacheService) {
      const vm = this;
      vm.login = LoginService.open;
      vm.isAuthenticated = Principal.isAuthenticated;
      vm.isCellar = isCellar;
      vm.logout = logout;

      function logout() {
        Auth.logout();
        CacheService.removeAll();
        $state.go('home', {}, {reload: true});
      }

      function isCellar() {
        const activeCellar = CacheService.get('activeCellar');
        return activeCellar !== null && typeof activeCellar !== 'undefined';
      }

    });
})();
