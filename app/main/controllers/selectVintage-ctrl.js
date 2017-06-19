'use strict';
angular
.module('main')
.controller('SelectVintage', SelectVintage);

SelectVintage.$inject = ['$scope', '$state', 'Vintage', 'Wine', 'Principal', '$stateParams', '$ionicModal', 'Year', 'CacheService', 'PinnedVintage', 'CommonServices'];

function SelectVintage ($scope, $state, Vintage, Wine, Principal, $stateParams, $ionicModal, Year, CacheService, PinnedVintage, CommonServices) {
	var vm = this;
	var user;
	vm.addToCellar = addToCellar;
	vm.wineId = $stateParams.wineId;
	vm.vintages = Wine.vintages({id:vm.wineId});
	vm.createVintage = createVintage;
	vm.pinVintage = pinVintage;
	vm.years = Year.query();
	vm.openCreateVintage = openCreateVintage;
	vm.wine = CacheService.get('selectedWine');

	$scope.$on('$ionicView.enter', function(e) { 
		Principal.identity().then(function(account) {
			user = account;
		}, function(){
			CommonServices.showAlert('error.getCellar');
		}); 
	});


	function addToCellar(){
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

	function pinVintage(){
		vm.selectedVintage;
		PinnedVintage.save({vintage:vm.selectedVintage, userId:user.id}, function(value) {
			//$state.go('addToCellar');
		}, function(){
		  CommonServices.showAlert('error.createColor');
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