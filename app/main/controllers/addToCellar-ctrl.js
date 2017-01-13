'use strict';

angular
.module('main')
.controller('addToCellarCtrl',['$log', '$scope', '$state', 'Vintage', 'WineInCellar', 'User', 'Principal', '$stateParams', function ($log, $scope, $state, Vintage, WineInCellar,User, Principal, $stateParams) {

  var activeWineId;
  var account;
  var cellar;
  $scope.userWine = {};

  $scope.$on('$ionicView.enter', function(e) { 
    activeWineId = $stateParams.vintageId;
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
    if (typeof activeWineId != 'undefined'){
      $scope.userWine = {
        id : "",
        quantity: "",
        price:"",
        vintage:null,
        cellarId:cellar.id,
        comments:null
      };

      Vintage.get({id:activeWineId},function(result){
        $scope.userWine.vintage = result;
      });

    } 
  };


  $scope.submit = function() {
    if (!$scope.form.$invalid) {
      var newWineInCellar = new WineInCellar($scope.userWine);
      newWineInCellar.$save(function(value,responseHeaders,status) {
          $state.go('list');
      });

    }
  };

}]);
