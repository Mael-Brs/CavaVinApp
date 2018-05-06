(function() {


  angular
    .module('main')
    .controller('WineInCellarEditCtrl', WineInCellarEditCtrl);

  WineInCellarEditCtrl.$inject = ['$ionicHistory', '$scope', '$state', 'Vintage', 'WineInCellar', 'Cellar', 'Principal', '$stateParams', 'CacheService', 'CommonServices'];

  function WineInCellarEditCtrl($ionicHistory, $scope, $state, Vintage, WineInCellar, User, Principal, $stateParams, CacheService, CommonServices) {
    const vm = this;
    let cellar;
    vm.submit = submit;
    vm.userWine = {};
    vm.activeWineId;
    vm.isProcessing = false;

    $scope.$on('$ionicView.enter', function() {
      vm.activeWineId = $stateParams.wineId;
      getCellar();
    });

    function getCellar() {
      CommonServices.getCellar().then(function(result) {
        cellar = result;
        vm.userWine.cellarId = result.id;
        inputInit();
      });
    }

    /**********Functions**********/
    function inputInit() {
      if (vm.activeWineId === '-1') {
        vm.userWine = {
          id: '',
          quantity: '',
          price: '',
          vintage: null,
          comments: null,
          cellarId: cellar.id
        };
        vm.userWine.vintage = CacheService.get('selectedVintage');
      } else {
        vm.userWine = CacheService.get('selectedWineInCellar');
      }
    }

    function submit() {
      vm.isProcessing = true;
      if (!$scope.form.$invalid) {
        const newWineInCellar = new WineInCellar(vm.userWine);

        newWineInCellar.$save(function(wineInCellar) {
          updateCacheData(wineInCellar);
        }, function() {
          CommonServices.showAlert('error.createWine');
        });
      }
    }

    function updateCacheData(wineInCellar) {
      CommonServices.getWinesInCellar().then(wineInCellars => {
        if (wineInCellars) {
          CommonServices.updateWineInCellar(wineInCellar);
          CommonServices.updateCellarDetails();
        }
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        vm.isProcessing = false;
        $state.go('home');
      });
    }

  }
})();
