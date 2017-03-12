'use strict';
angular
.module('main')
.controller('SelectVintage', SelectVintage);

SelectVintage.$inject = ['$log', '$scope', '$state', 'Vintage', 'Wine', 'User', '$stateParams', '$ionicModal', 'Year', 'CacheService'];

function SelectVintage ($log, $scope, $state, Vintage, Wine, User, $stateParams, $ionicModal, Year, CacheService) {
	var vm = this;
	vm.select = select;
	vm.wineId = $stateParams.wineId;
	vm.vintages = Wine.vintages({id:vm.wineId});
	vm.createVintage = createVintage;
	vm.years = Year.query();
	vm.openCreateVintage = openCreateVintage;
	vm.wine = CacheService.get('selectedWine');

	function select(){
		CacheService.put('selectedVintage', vm.selectedVintage);
		$state.go('addToCellar');
	}

	function createVintage(){
		var newVintage = new Vintage({year:vm.selectedYear, maxKeep:vm.maxKeep, wine:{id:vm.wineId}});
		newVintage.$save(function(){
			vm.modal.hide();
			vm.vintages = Wine.vintages({id:vm.wineId});
		});

	}

	$ionicModal.fromTemplateUrl('main/templates/createVintageModal.html', {
  		scope: $scope,
  		animation: 'slide-in-up'
  	}).then(function(modal) {
     	vm.modal = modal;
  	});

  function openCreateVintage(){
      vm.modal.show();
  }

}