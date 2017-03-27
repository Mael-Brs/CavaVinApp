'use strict';
angular.module('main')
    .controller('CellarDetailsCtrl', CellarDetailsCtrl);

    CellarDetailsCtrl.$inject = ['$scope', '$rootScope', '$state', 'Principal', 'CacheService', 'Cellar', 'User'];

    function CellarDetailsCtrl($scope, $rootScope, $state, Principal, CacheService, Cellar, User) {
        var vm = this;
        vm.cellar;

        $scope.$on('$ionicView.enter', function() { 
            getCellarDetails();
        });

        function getCellarDetails() {
            vm.cellar = CacheService.get('activeCellar');
            if(vm.cellar){
                vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
                vm.wineByRegion = vm.cellar.wineByRegion;
                vm.wineByColor = vm.cellar.wineByColor;
                vm.wineByYear = vm.cellar.wineByYear;
            } else {
                getCellar();
            }
        }

        function getCellar(){
            Principal.identity().then(function(account) {
                User.cellars({login:account.login}, function(result){
                    vm.cellar = result;
                    if(vm.cellar){
                        vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
                        vm.wineByRegion = vm.cellar.wineByRegion;
                        vm.wineByColor = vm.cellar.wineByColor;
                    }
                });
            });
        }

    }
