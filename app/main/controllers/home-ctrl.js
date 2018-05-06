(function() {

  angular.module('main')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$state', 'Principal', 'LoginService', '$ionicModal', 'User', 'CacheService', 'Cellar', 'CommonServices'];

  function HomeCtrl($scope, $rootScope, Auth, $state, Principal, LoginService, $ionicModal, User, CacheService, Cellar, CommonServices) {
    const vm = this;
    vm.account = null;
    vm.isAuthenticated = null;
    vm.isLoading = false;
    vm.login = LoginService.open;
    vm.register = register;
    vm.cellar = null;
    vm.openModal = openModal;
    vm.save = saveCellar;

    $scope.$on('$ionicView.enter', function() {
      vm.isAuthenticated = Principal.isAuthenticated();
      if (vm.isAuthenticated === true) {
        getAccount();
        getCellarDetails();
      }
    });

    function getCellarDetails() {
      vm.isLoading = true;
      CommonServices.getCellar().then(cellar => {
        vm.cellar = cellar;
        vm.isLoading = false;
        if (vm.cellar) {
          vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
          CommonServices.getWinesInCellar();
        }
      });
    }

    function getAccount() {
      Principal.identity().then(function(account) {
        vm.account = account;
      });
    }

    function register() {
      $state.go('register');
    }

    $ionicModal.fromTemplateUrl('main/templates/createCellar.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });

    function openModal() {
      vm.modal.show();
    }

    function saveCellar() {
      vm.cellar.userId = vm.account.id;
      Cellar.save(vm.cellar, onSaveSuccess, onSaveError);
    }

    function onSaveSuccess() {
      vm.success = 'OK';
      vm.modal.hide();
      getCellarDetails();
    }

    function onSaveError() {
      vm.error = 'ERROR';
    }
  }
})();
