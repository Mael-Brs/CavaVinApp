'use strict';

angular
.module('main')
.controller('addToCellarCtrl',['$log', '$scope', '$state', 'Vintage', 'WineInCellar', 'User', 'Principal', '$stateParams', 'CacheService', function ($log, $scope, $state, Vintage, WineInCellar,User, Principal, $stateParams, CacheService) {

  var activeWineId;
  var account;
  var cellar;
  $scope.userWine = {};

  $scope.$on('$ionicView.enter', function(e) { 
    activeWineId = $stateParams.wineId;
    inputInit();
  });

  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(result){
      $scope.userWine.cellarId = result.id;
    });
  });
      
  /**********Functions**********/
  function inputInit(){
    if (activeWineId == -1){
      $scope.userWine = {
        id : "",
        quantity: "",
        price:"",
        vintage:null,
        comments:null
      };

      $scope.userWine.vintage = CacheService.getSelectedVintage();

    } else {
      $scope.userWine = WineInCellar.get({id:activeWineId});
    }
  };


  $scope.submit = function() {
    if (!$scope.form.$invalid) {
      var newWineInCellar = new WineInCellar($scope.userWine);
      newWineInCellar.$save(function() {
          $state.go('list');
      });

    }
  };

}]);
