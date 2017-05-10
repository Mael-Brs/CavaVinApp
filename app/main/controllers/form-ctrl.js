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
      cellar = User.cellars({login:account.login},function(result){
        vm.userWine.cellarId = result.id;
        inputInit();
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
        id : null,
        vintage : {
          id : null,
          bareCode : null,
          year : {
            id : null,
            number : null
          },
          wine : {
            id : null,
            name : "",
            appellation : "",
            producer : "",
            creatorId: cellar.userId,
            region : {
              id : null,
              regionName : ""
            },
            color : {
              id : null,
              colorName : ""
            }
          }
        },
        quantity: "",
        price:"",
        maxKeep:null,
        minKeep:null,
        cellarId:cellar.id
      };

    } else if (vm.activeWineId != -1){
      WineInCellar.get({id:vm.activeWineId}, function successCallback(result) {
          vm.userWine = result;
      }, function errorCallback(response) {

      });
    }

  }

  function loadRegions() {
    if (typeof vm.regions === 'undefined'){
      Region.query(function(result){
        vm.regions = result;
        vm.regions.push({id:"-1",regionName:"Autre"});
      });
    }
  }

  function loadColors(){
    if(typeof vm.colors === 'undefined'){
      Color.query(function(result){
        vm.colors = result;
        vm.colors.push({id:"-1", colorName:"Autre"});
      });
    }
  }

  function loadYears(){
    vm.years = Year.query();
  }

  function addRegion(region){
    Region.save(region, function(value) {
        vm.userWine.vintage.wine.region = value;
        submit();
    });
  }

  function addColor(color){
    Color.save(color, function(value) {
        vm.userWine.vintage.wine.color = value;
        submit();
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
      } else {
        Cellar.wineInCellars({id:cellar.id}, function(wines){
          CacheService.put('wineInCellars', wines);
        });
      }

      CommonServices.updateCellarDetails();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('home');
    });
  }

  function update(newWine, newVintage, newWineInCellar){

    WineInCellar.updateAll(newWineInCellar, function(wineInCellar) {
      var wineInCellars = CacheService.get('wineInCellars');

      if(wineInCellars){
          CommonServices.updateWineInCellar(wineInCellar);
      } else {
        Cellar.wineInCellars({id:cellar.id}, function(wines){
          CacheService.put('wineInCellars', wines);
        });
      }

      CommonServices.updateCellarDetails();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('list');
    });
  }

}]);
