'use strict';

angular
.module('main')
.controller('addToCellarCtrl',['$ionicHistory', '$scope', '$state', 'Vintage', 'WineInCellar', 'User', 'Principal', '$stateParams', 'CacheService', 'StatService', 'Cellar', function ($ionicHistory, $scope, $state, Vintage, WineInCellar,User, Principal, $stateParams, CacheService, StatService, Cellar) {

  var vm = this;
  vm.submit = submit;
  vm.userWine = {};
  var account;
  var cellar;

  $scope.$on('$ionicView.enter', function(e) { 
    cellar = CacheService.get('activeCellar');
    if(!cellar){
      getCellar();
    } else {
      inputInit();
    }
  });

  function getCellar(){
    Principal.identity().then(function(account) {
      account = account;
      cellar = User.cellars({login:account.login},function(result){
        vm.userWine.cellarId = result.id;
        inputInit();
      });
    }); 
  }
      
  /**********Functions**********/
  function inputInit(){
      vm.userWine = {
        id : "",
        quantity: "",
        price:"",
        vintage:null,
        comments:null,
        cellarId:cellar.id
      };
      vm.userWine.vintage = CacheService.get('selectedVintage');
  }

   function submit() {
    if (!$scope.form.$invalid) {
      var newWineInCellar = new WineInCellar(vm.userWine);

      newWineInCellar.$save(function(wineInCellar) {
        var wineInCellars = CacheService.get('wineInCellars');

        if(wineInCellars){
          wineInCellars.push(wineInCellar);
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
