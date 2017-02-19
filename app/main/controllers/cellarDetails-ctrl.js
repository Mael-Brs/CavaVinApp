'use strict';
angular.module('main')
    .controller('CellarDetailsCtrl', CellarDetailsCtrl);

    CellarDetailsCtrl.$inject = ['$scope', '$rootScope', '$state', 'Principal', 'CacheService', 'Cellar'];

    function CellarDetailsCtrl($scope, $rootScope, $state, Principal, CacheService, Cellar) {
        var vm = this;
        vm.cellar;

        $scope.$on('$ionicView.enter', function() { 
            getCellarDetails();
        });

        getCellarDetails();

        function getCellarDetails() {
            vm.cellar = CacheService.getActiveCellar();
            if(vm.cellar){
                vm.sum = vm.cellar.sumOfWine != null ? vm.cellar.sumOfWine : 0;
                vm.wineByRegion = vm.cellar.wineByRegion;
                vm.wineByColor = vm.cellar.wineByColor;
            }
        }

    };
