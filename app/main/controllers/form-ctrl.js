'use strict';

angular
.module('main')
.controller('FormCtrl',['$ionicHistory', '$scope', '$state', 'Wine', 'WineInCellar', 'Region', 'Color', 'User', 'Principal', '$stateParams', 'Year', 'Vintage', 'CacheService', 'CommonServices', 'Cellar', function ($ionicHistory, $scope, $state, Wine, WineInCellar, Region, Color,User, Principal, $stateParams, Year, Vintage, CacheService, CommonServices, Cellar) {
  var vm = this;
  var account;
  var cellar;
  vm.activeWineId;
  vm.userWine = {};
  vm.submit = submit;

  $scope.$on('$ionicView.enter', function() {
    vm.activeWineId = $stateParams.wineId;
    cellar = CacheService.get('activeCellar');
    if(!cellar){
      getCellar();
    } else {
      inputInit();
    }
  });

  function getCellar(){
    Principal.identity().then(function(value) {
      account = value;
      cellar = User.cellars({ref:account.id},function(result){
        vm.userWine.cellarId = result.id;
        inputInit();
      }, function(){
          CommonServices.showAlert('error.getCellar');
      });
    });
  }

  function inputInit(){
    vm.newColor = {
      id:"",
      name:""
    };
    vm.newRegion ={
      id:"",
      nom:""
    };

    loadRegions();
    loadColors();
    loadYears();

    if (vm.activeWineId == -1){
      vm.userWine = {
        vintage : {
          wine : {
            creatorId: cellar.userId
          }
        },
        cellarId:cellar.id
      };

    } else if (vm.activeWineId != -1){
      WineInCellar.get({id:vm.activeWineId}, function successCallback(result) {
          vm.userWine = result;
      }, function () {
        CommonServices.showAlert('error.getWine');
      });
    }

  }

  function loadRegions() {
    if (typeof vm.regions === 'undefined'){
      Region.query(function(result){
        vm.regions = result;
        vm.regions.push({id:"-1",regionName:"Autre"});
      }, function(){
        CommonServices.showAlert('error.getRegions');
      });
    }
  }

  function loadColors(){
    if(typeof vm.colors === 'undefined'){
      Color.query(function(result){
        vm.colors = result;
        vm.colors.push({id:"-1", colorName:"Autre"});
      }, function(){
        CommonServices.showAlert('error.getColors');
      });
    }
  }

  function loadYears(){
    Year.query(function(result){
      vm.years = result;
    }, function(){
      CommonServices.showAlert('error.getYears');
    });
  }

  function addRegion(region){
    Region.save(region, function(value) {
        vm.userWine.vintage.wine.region = value;
        submit();
    }, function(){
      CommonServices.showAlert('error.createRegion');
    });
  }

  function addColor(color){
    Color.save(color, function(value) {
        vm.userWine.vintage.wine.color = value;
        submit();
    }, function(){
      CommonServices.showAlert('error.createColor');
    });
  }


  function submit() {

    if (!$scope.form.$invalid) {

      if(vm.userWine.vintage.wine.region.regionName === "Autre"){
        addRegion(vm.newRegion);
      } else if(vm.userWine.vintage.wine.color.colorName === "Autre"){
        addColor(vm.newColor);
      } else {

        if(vm.activeWineId == -1){
          create(vm.userWine.vintage.wine, vm.userWine.vintage, vm.userWine);
        } else {
          update(vm.userWine.vintage.wine, vm.userWine.vintage, vm.userWine);
        }
      }
    }
  }

  function create(newWine, newVintage, newWineInCellar){

    WineInCellar.saveAll(newWineInCellar, function(wineInCellar) {
      var wineInCellars = CacheService.get('wineInCellars');

      if(wineInCellars){
        wineInCellars.push(wineInCellar);
        CacheService.put('wineInCellars', wineInCellars);
        CommonServices.updateCellarDetails();
      } else {
        getWineInCellars();
      }

      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $state.go('home');
    }, function(){
        CommonServices.showAlert('error.createWine');
    });
  }

  function update(newWine, newVintage, newWineInCellar){

    WineInCellar.updateAll(newWineInCellar, function(wineInCellar) {
      var wineInCellars = CacheService.get('wineInCellars');

      if(wineInCellars){
        CommonServices.updateWineInCellar(wineInCellar);
        CommonServices.updateCellarDetails();
      } else {
        getWineInCellars();
      }

      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $state.go('list');
    }, function(){
        CommonServices.showAlert('error.updateWine');
    });
  }

  function getWineInCellars(){
    Cellar.wineInCellars({id:cellar.id}, function(wineInCellars){
      CacheService.put('wineInCellars', wineInCellars);
      //Update cache
      CommonServices.updateCellarDetails();
    }, function(){
      CommonServices.showAlert('error.getWines');
    });
  }

}]);
