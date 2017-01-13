'use strict';
angular
.module('main')
.controller('SelectVintage', SelectVintage);

SelectVintage.$inject = ['$log', '$scope', '$state', 'Principal', 'Vintage', 'Wine', 'User', '$stateParams', '$ionicModal', 'Year'];

function SelectVintage ($log, $scope, $state, Principal, Vintage, Wine, User, $stateParams, $ionicModal, Year) {
	var vm = this;
	vm.select = select;
	vm.wineId = $stateParams.wineId;
	vm.vintages = Wine.vintages({id:vm.wineId});
	vm.createVintage = createVintage;
	vm.years = Year.query();
	vm.openCreateVintage = openCreateVintage;

	function select(){
		$state.go('addToCellar',{vintageId:vm.selectedVintage.id});
	};

	function createVintage(){
		var newVintage = new Vintage({year:vm.selectedYear, wine:{id:vm.wineId}});
		newVintage.$save(function(){
			vm.modal.hide();
			vm.vintages = Wine.vintages({id:vm.wineId});
		});

	};

	$ionicModal.fromTemplateUrl('main/templates/createVintageModal.html', {
  		scope: $scope,
  		animation: 'slide-in-up'
  	}).then(function(modal) {
     	vm.modal = modal;
  	});

  function openCreateVintage(){
      vm.modal.show();
  }

};