(function () {
  'use strict';

  angular
  .module('main')
  .controller('editWineCtrl',['$ionicHistory', '$scope', '$state', 'WineInCellar', '$stateParams', 'CacheService', 'CommonServices', 'Cellar', function ($ionicHistory, $scope, $state, WineInCellar, Principal, $stateParams, CacheService, CommonServices, Cellar) {

    var vm = this;
    vm.submit = submit;
    vm.userWine = {};
    var activeWineId;
    var cellar;

    $scope.$on('$ionicView.enter', function(e) { 
      activeWineId = $stateParams.wineId;
      CommonServices.getCellar().then(function(result){
        cellar = result;
        vm.userWine.cellarId = result.id
        getWine();
      });
    });
        
    /**********Functions**********/
    function getWine(){
      if (activeWineId != -1){
        vm.userWine = WineInCellar.get({id:activeWineId});
      }
    }

    function submit() {
      if (!$scope.form.$invalid) {
        WineInCellar.update(vm.userWine, function(wineInCellar) {
          var wineInCellars = CacheService.get('wineInCellars');

          if(wineInCellars){
              CommonServices.updateWineInCellar(wineInCellar);
          } else {
            Cellar.wineInCellars({id:cellar.id}, function(wines){
              CacheService.put('wineInCellars', wines);
            });
          }

          CommonServices.updateCellarDetails();
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('list');
        });
      }
    }

  }]);
})();