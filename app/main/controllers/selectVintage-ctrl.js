(function() {

  angular
    .module('main')
    .controller('SelectVintage', SelectVintage);

  SelectVintage.$inject = ['$scope', '$state', 'Vintage', 'Wine', 'Principal', '$stateParams', '$ionicModal', 'CacheService', 'PinnedWine', 'CommonServices'];

  function SelectVintage($scope, $state, Vintage, Wine, Principal, $stateParams, $ionicModal, CacheService, PinnedWine, CommonServices) {
    const vm = this;
    let user;
    vm.isProcessing = false;
    vm.wineInCellarEdit = wineInCellarEdit;
    vm.createVintage = createVintage;
    vm.pinWine = pinWine;
    vm.openCreateVintage = openCreateVintage;

    $scope.$on('$ionicView.enter', function() {
      vm.wineId = $stateParams.wineId;
      vm.from = $stateParams.from;
      getWine();
      vm.vintages = Wine.vintages({ id: vm.wineId });
      Principal.identity().then(function(account) {
        user = account;
      }, function() {
        CommonServices.showAlert('error.getCellar');
      });
    });

    function getWine() {
      vm.wine = CacheService.get('selectedWine');
      if (!vm.wine) {
        Wine.get({ id: vm.wineId }, function(result) {
          vm.wine = result;
        });
      }
    }

    function wineInCellarEdit() {
      CacheService.put('selectedVintage', vm.selectedVintage);
      $state.go('wineInCellarEdit', { wineId: -1 });
    }

    function createVintage() {
      vm.isProcessing = true;
      const newVintage = new Vintage({ year: vm.newYear, wine: { id: vm.wineId }, childYear: vm.childYear, apogeeYear: vm.apogeeYear, bareCode: vm.bareCode });
      newVintage.$save(function() {
        vm.modal.hide();
        vm.vintages = Wine.vintages({ id: vm.wineId });
        vm.isProcessing = false;
      });

    }

    function pinWine() {
      vm.isProcessing = true;
      PinnedWine.save({ wine: vm.wine, userId: user.id }, function(result) {
        CommonServices.addPinnedWineInCache(result);
        vm.isProcessing = false;
        $state.go('pinnedList');
      }, function() {
        CommonServices.showAlert('error.createPinnedWine');
      });
    }

    $ionicModal.fromTemplateUrl('main/templates/createVintageModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });

    function openCreateVintage() {
      vm.modal.show();
    }

  }
})();
