'use strict';
angular
.module('main')
.controller('WineSearchCtrl', WineSearchCtrl);

WineSearchCtrl.$inject = ['$log', '$scope', '$state', 'Principal', 'WineSearch','Cellar', 'User', '$ionicModal', 'CacheService'];

function WineSearchCtrl ($log, $scope, $state, Principal, WineSearch,Cellar,User, $ionicModal, CacheService) {
  var vm = this;
  var account;
  //var cellar;
  vm.submit = submit;

 /* Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(cellar){

    });
  });*/
  
  function submit (query) {
    if (typeof query != 'undefined') {
      WineSearch.query({query: query}, function(result) {
          vm.result = result;
      });
    }
  };

  vm.createWine = function(id){
    $state.go('form',{wineId:id});
  };

  vm.selectVintage = function(wine){
    CacheService.put('selectedWine', wine);
    $state.go('selectVintage',{wineId:wine.id});
  }

};
