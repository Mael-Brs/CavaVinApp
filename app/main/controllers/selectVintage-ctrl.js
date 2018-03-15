(function () {
  'use strict';
  angular
    .module('main')
    .controller('SelectVintage', SelectVintage);

  SelectVintage.$inject = ['$scope', '$state', 'Vintage', 'Wine', 'Principal', '$stateParams', '$ionicModal', 'CacheService', 'PinnedWine', 'CommonServices'];

  function SelectVintage($scope, $state, Vintage, Wine, Principal, $stateParams, $ionicModal, CacheService, PinnedWine, CommonServices) {
    var vm = this;
    var user;
    vm.addToCellar = addToCellar;
    vm.createVintage = createVintage;
    vm.pinWine = pinWine;
    vm.openCreateVintage = openCreateVintage;

    $scope.$on('$ionicView.enter', function () {
      vm.wineId = $stateParams.wineId;
      getWine();
      vm.vintages = Wine.vintages({ id: vm.wineId });
      Principal.identity().then(function (account) {
        user = account;
      }, function () {
        CommonServices.showAlert('error.getCellar');
      });
    });

    function getWine() {
      vm.wine = CacheService.get('selectedWine');
      if (!vm.wine) {
        Wine.get({ id: vm.wineId }, function (result) {
          vm.wine = result;
        });
      }
    }

    function addToCellar() {
      CacheService.put('selectedVintage', vm.selectedVintage);
      $state.go('addToCellar');
    }

    function createVintage() {
      var newVintage = new Vintage({ year: vm.newYear, wine: { id: vm.wineId }, bareCode: vm.bareCode });
      newVintage.$save(function () {
        vm.modal.hide();
        vm.vintages = Wine.vintages({ id: vm.wineId });
      });

    }

    function pinWine() {
      PinnedWine.save({ wine: vm.wine, userId: user.id }, function () {
        $state.go('pinnedList');
      }, function () {
        CommonServices.showAlert('error.createPinnedWine');
      });
    }

    $ionicModal.fromTemplateUrl('main/templates/createVintageModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      vm.modal = modal;
    });

    function openCreateVintage() {
      vm.modal.show();
    }

  }
})();