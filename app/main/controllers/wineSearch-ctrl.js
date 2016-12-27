'use strict';
angular
.module('main')
.controller('wineSearchCtrl',['$log', '$scope', '$state', 'Principal', 'WineSearch','Cellar', 'User', function ($log, $scope, $state, Principal, WineSearch,Cellar,User) {

  var account;
  var cellar;
  $scope.search = {};
  $scope.search.submit = submit;

  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(cellar){

    });
  });
  
  function submit (query) {
    if (typeof query != 'undefined') {
      WineSearch.query({query: query}, function(result) {
          $scope.search.result = result;
      });
    }
  };

  $scope.addToCellar = function(id){
    $state.go('addToCellar',{wineId:id});
  };
  
  $scope.editWine = function(id){
    $state.go('form',{wineId:id});
  };

}]);
