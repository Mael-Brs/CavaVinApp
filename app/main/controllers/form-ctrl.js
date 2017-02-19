'use strict';

angular
.module('main')
.controller('FormCtrl',['$log', '$scope', '$state', 'Wine', 'WineInCellar', 'Region', 'Color', 'User', 'Principal', '$stateParams','Year','Vintage', function ($log, $scope, $state, Wine, WineInCellar, Region, Color,User, Principal, $stateParams, Year, Vintage) {
  var vm = this;
  var activeWineId;
  var account;
  var cellar;
  vm.userWine = {};
  vm.submit = submit;

  $scope.$on('$ionicView.enter', function(e) { 
    activeWineId = $stateParams.wineId;
    inputInit();
  });

  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(result){
      vm.userWine.cellarId = result.id;
    });
  });
      
  //-------Functions-------------\\
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

    if (activeWineId == -1){
      vm.userWine = {
        id : "",
        wine:{
          name : "",
          appellation : "",
          year : "",
          region : {
            id:"",
            regionName:""
          },
          color :{
            id:"",
            colorName:""
          }
        },
        quantity: "",
        price:"",
        maxKeep:null,
        minKeep:null,
        cellarId:cellar.id
      };

    } else if (activeWineId != -1){
      WineInCellar.get({id:activeWineId}, function successCallback(result) {
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
    Region.save(region, function(value,responseHeaders,status) {
        vm.userWine.vintage.wine.region = value;
        submit();
    });
  }

  function addColor(color){
    Color.save(color, function(value,responseHeaders,status) {
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
        var newWine = new Wine(vm.userWine.vintage.wine);
        var newVintage = new Vintage(vm.userWine.vintage.wine)
        var newWineInCellar = new WineInCellar(vm.userWine);

        newWine.$save(function(value,responseHeaders,status) {
            newVintage.wine = newWine;
            newVintage.$save(function(value,responseHeaders,status) {
              newWineInCellar.vintage = newVintage;
              newWineInCellar.$save(function(value,responseHeaders,status) {
                  inputInit();
              });
            });
        });
      }
    }
  }

}]);
