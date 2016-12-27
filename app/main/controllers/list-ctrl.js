'use strict';
angular
.module('main')
.controller('ListCtrl',['$log', '$scope', '$state', 'WineInCellar', 'Principal', '$ionicPopup','Cellar', 'User', function ($log, $scope, $state, WineInCellar, Principal, $ionicPopup,Cellar,User) {

  $log.log('Hello from your Controller: ListCtrl in module main:. This is your controller:', this);

  $scope.wines;
  $scope.showForm = false;
  $scope.sortColor = 'appellation'; // set the default sort color
  $scope.sortReverse = false;
  var account;
  var cellar;
  
  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(cellar){
      loadAll();
    });
  });

  function loadAll() {
    Cellar.wineInCellars({id:cellar.id}, function(wineInCellars){
      $scope.wines = wineInCellars;
    });
  };
  
  $scope.addWine = function(id){
    $state.go('wineSearch');
  };

  $scope.removeWine = function(id){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Supprimer le vin',
      template: 'Etes-vous sûr de vouloir supprimer ce vin?'
    });
    confirmPopup.then(function(res) {
      if(res) {
          WineInCellar.delete({id: id}, function successCallback() {
              loadAll();
          });
       } 
     });
  };
  

}]);
