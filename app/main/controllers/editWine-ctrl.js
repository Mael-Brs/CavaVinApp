'use strict';

angular
.module('main')
.controller('editWineCtrl',['$ionicHistory', '$scope', '$state', 'WineInCellar', 'User', 'Principal', '$stateParams', 'CacheService', 'StatService', 'Cellar', function ($ionicHistory, $scope, $state, WineInCellar,User, Principal, $stateParams, CacheService, StatService, Cellar) {

  var vm = this;
  vm.submit = submit;
  vm.userWine = {};
  var activeWineId;
  var account;
  var cellar;

  $scope.$on('$ionicView.enter', function(e) { 
    activeWineId = $stateParams.wineId;
    cellar = CacheService.get('activeCellar');
    if(!cellar){
      getCellar();
    } else {
      getWine();
    }
  });

  function getCellar(){
    Principal.identity().then(function(account) {
      account = account;
      cellar = User.cellars({login:account.login},function(result){
        vm.userWine.cellarId = result.id;
        getWine();
      });
    }); 
  }
      
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
          for(var i = 0 ; i < wineInCellars.length ; i++){
            if(wineInCellars[i].id === wineInCellar.id){
              wineInCellars[i] = wineInCellar;
            }
          }
          CacheService.put('wineInCellars', wineInCellars);
        } else {
          Cellar.wineInCellars({id:cellar.id}, function(wines){
            CacheService.put('wineInCellars', wines);
          });
        }

        StatService.updateCellarDetails();
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('list');
      });
    }
  }

}]);
