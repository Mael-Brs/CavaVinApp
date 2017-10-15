'use strict';
angular.module('main')
    .controller('CellarDetailsCtrl', CellarDetailsCtrl);

    CellarDetailsCtrl.$inject = ['$scope', 'CacheService', 'CommonServices'];

    function CellarDetailsCtrl($scope, CacheService, CommonServices) {
        var vm = this;
        vm.cellar;

        $scope.$on('$ionicView.enter', function() { 
            getCellarDetails();
        });

        function getCellarDetails(){
            CommonServices.getCellar().then(function(result){
                vm.cellar = result;
                vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
                vm.wineByRegion = vm.cellar.wineByRegion;
                vm.wineByColor = vm.cellar.wineByColor;
                vm.wineByYear = vm.cellar.wineByYear;
            });
        }

    }
