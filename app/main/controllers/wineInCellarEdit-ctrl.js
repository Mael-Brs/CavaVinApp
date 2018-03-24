(function() {
  'use strict';

  angular
    .module('main')
    .controller('WineInCellarEditCtrl', WineInCellarEditCtrl);

  WineInCellarEditCtrl.$inject = ['$ionicHistory', '$scope', '$state', 'Vintage', 'WineInCellar', 'Cellar', 'Principal', '$stateParams', 'CacheService', 'CommonServices', 'Cellar'];

  function WineInCellarEditCtrl($ionicHistory, $scope, $state, Vintage, WineInCellar, User, Principal, $stateParams, CacheService, CommonServices, Cellar) {
    var vm = this;
    var cellar;
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
      if (vm.activeWineId == -1) {
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
        var newWineInCellar = new WineInCellar(vm.userWine);

        newWineInCellar.$save(function(wineInCellar) {
          var wineInCellars = CacheService.get('wineInCellars');

          if (wineInCellars) {
            wineInCellars.push(wineInCellar);
            CacheService.put('wineInCellars', wineInCellars);
            CommonServices.updateCellarDetails();
          } else {
            Cellar.wineInCellars({ id: cellar.id }, function(wines) {
              CacheService.put('wineInCellars', wines);
              CommonServices.updateCellarDetails();
            });
          }

          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          vm.isProcessing = false;
          $state.go('home');
        }, function() {
          CommonServices.showAlert('error.createWine');
        });
      }
    }

  }
})();