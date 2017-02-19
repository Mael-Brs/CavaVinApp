'use strict';

angular
.module('main')
.controller('addToCellarCtrl',['$log', '$scope', '$state', 'Vintage', 'WineInCellar', 'User', 'Principal', '$stateParams', 'CacheService', function ($log, $scope, $state, Vintage, WineInCellar,User, Principal, $stateParams, CacheService) {

  var vm = this;
  vm.submit = submit;
  vm.userWine = {};
  var activeWineId;
  var account;
  var cellar;

  $scope.$on('$ionicView.enter', function(e) { 
    activeWineId = $stateParams.wineId;
    inputInit();
  });

  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(result){
      vm.userWine.cellarId = result.id;
    });
  });
      
  /**********Functions**********/
  function inputInit(){
    if (activeWineId == -1){
      vm.userWine = {
        id : "",
        quantity: "",
        price:"",
        vintage:null,
        comments:null,
        cellarId:cellar.id
      };

      vm.userWine.vintage = CacheService.getSelectedVintage();

    } else {
      vm.userWine = WineInCellar.get({id:activeWineId});
      vm.cellarId = cellar.id;
    }
  }

   function submit() {
    if (!$scope.form.$invalid) {
      var newWineInCellar = new WineInCellar(vm.userWine);
      newWineInCellar.$save(function() {
          $state.go('list');
      });

    }
  }

}]);
