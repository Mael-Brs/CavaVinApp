(function () {
  'use strict';

  angular
    .module('main')
    .controller('addToCellarCtrl', ['$ionicHistory', '$scope', '$state', 'Vintage', 'WineInCellar', 'Cellar', 'Principal', '$stateParams', 'CacheService', 'CommonServices', 'Cellar', function ($ionicHistory, $scope, $state, Vintage, WineInCellar, User, Principal, $stateParams, CacheService, CommonServices, Cellar) {

      var vm = this;
      vm.submit = submit;
      vm.userWine = {};
      var cellar;

      $scope.$on('$ionicView.enter', function () {
        cellar = CacheService.get('activeCellar');
        if (!cellar) {
          getCellar();
        } else {
          inputInit();
        }
      });

      function getCellar() {
        CommonServices.getCellar().then(function (result) {
          cellar = result;
          vm.userWine.cellarId = result.id;
          inputInit();
        });
      }

      /**********Functions**********/
      function inputInit() {
        vm.userWine = {
          id: '',
          quantity: '',
          price: '',
          vintage: null,
          comments: null,
          cellarId: cellar.id
        };
        vm.userWine.vintage = CacheService.get('selectedVintage');
      }

      function submit() {
        if (!$scope.form.$invalid) {
          var newWineInCellar = new WineInCellar(vm.userWine);

          newWineInCellar.$save(function (wineInCellar) {
            var wineInCellars = CacheService.get('wineInCellars');

            if (wineInCellars) {
              wineInCellars.push(wineInCellar);
              CacheService.put('wineInCellars', wineInCellars);
              CommonServices.updateCellarDetails();
            } else {
              Cellar.wineInCellars({ id: cellar.id }, function (wines) {
                CacheService.put('wineInCellars', wines);
                CommonServices.updateCellarDetails();
              });
            }

            $ionicHistory.nextViewOptions({
              disableBack: true
            });

            $state.go('home');
          }, function () {
            CommonServices.showAlert('error.createWine');
          });
        }
      }

    }]);
})();