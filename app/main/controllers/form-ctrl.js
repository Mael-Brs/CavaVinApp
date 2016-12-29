'use strict';

angular
.module('main')
.controller('FormCtrl',['$log', '$scope', '$state', 'Wine', 'WineInCellar', 'Region', 'Color', 'User', 'Principal', '$stateParams','Year', function ($log, $scope, $state, Wine, WineInCellar, Region, Color,User, Principal, $stateParams, Year) {

  var activeWineId;
  var account;
  var cellar;
  $scope.userWine = {};

  $scope.$on('$ionicView.enter', function(e) { 
    activeWineId = $stateParams.wineId;
    inputInit();
  });

  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(result){
      $scope.userWine.cellar = result;
    });
  });
      
  //-------Functions-------------\\
  function inputInit(){
    $scope.newColor = {
      id:"",
      name:""
    };
    $scope.newRegion ={
      id:"",
      nom:""
    };

    loadRegions();
    loadColors();
    loadYears();

    if (activeWineId == -1){
      $scope.userWine = {
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
        cellar:cellar
      };

    } else if (activeWineId != -1){
      WineInCellar.get({id:activeWineId}, function successCallback(result) {
          $scope.userWine = result;
      }, function errorCallback(response) {
      
      });
    }

  };

  function loadRegions() {
    if (typeof $scope.regions === 'undefined'){
      Region.query(function(result){
        $scope.regions = result;
        $scope.regions.push({id:"-1",regionName:"Autre"});
      });
    }
  };
  
  function loadColors(){
    if(typeof $scope.colors === 'undefined'){
      Color.query(function(result){
        $scope.colors = result;
        $scope.colors.push({id:"-1", colorName:"Autre"});
      });
    }
  };

  function loadYears(){
    $scope.years = Year.query();
  };

  function addRegion(region){
    Region.save(region, function(value,responseHeaders,status) {
        $scope.userWine.wine.region = value;
        $scope.submit();
    });
  };

  function addColor(color){
    Color.save(color, function(value,responseHeaders,status) {
        $scope.userWine.wine.color = value;
        $scope.submit();
    });
  };


  $scope.submit = function() {
    if (!$scope.form.$invalid) {
      if($scope.userWine.wine.region.regionName === "Autre"){         
        addRegion($scope.newRegion);
      } else if($scope.userWine.wine.color.colorName === "Autre"){
        addColor($scope.newColor);
      } else {
        var newWine = new Wine($scope.userWine.wine);
        //TODO add Vintage
        var newWineInCellar = new WineInCellar($scope.userWine);

        newWine.$save(function(value,responseHeaders,status) {
            newWineInCellar.wine = newWine;
            newWineInCellar.$save(function(value,responseHeaders,status) {
                inputInit();
            });
        });
      }
    }
  };

}]);
