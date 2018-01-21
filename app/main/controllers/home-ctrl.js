(function () {
    'use strict';
    angular.module('main')
        .controller('HomeCtrl', HomeCtrl);

        HomeCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$state', 'Principal', 'LoginService', '$ionicModal', 'User', 'CacheService', 'Cellar'];

        function HomeCtrl($scope, $rootScope, Auth, $state, Principal, LoginService, $ionicModal, User, CacheService, Cellar) {
            var vm = this;
            vm.account = null;
            vm.isAuthenticated = Principal.isAuthenticated;
            vm.login = LoginService.open;
            vm.register = register;
            vm.cellar = null;
            vm.openModal = openModal;
            vm.save = saveCellar;

            $scope.$on('$ionicView.enter', function() {
                getAccount();
                getCellarDetails();
            });

            function getCellarDetails() {
                vm.cellar = CacheService.get('activeCellar');
                if(vm.cellar){
                    vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
                } else {
                    getCellar();
                }
            }

            function getAccount() {
                Principal.identity().then(function(account) {
                    vm.account = account;
                });
            }

            function getCellar(){
                Cellar.query(function(result){
                    vm.cellar = result[0];
                    if(vm.cellar){
                        vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
                        CacheService.put('activeCellar',vm.cellar);
                    }
                });
            }

            function register () {
                $state.go('register');
            }

            $ionicModal.fromTemplateUrl('main/templates/createCellar.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                vm.modal = modal;
            });

            function openModal(){
                vm.modal.show();
            }

            function saveCellar(){
                vm.cellar.userId = vm.account.id;
                Cellar.save(vm.cellar, onSaveSuccess, onSaveError);
            }

            function onSaveSuccess () {
                vm.success = 'OK';
                vm.modal.hide();
                getCellar();
            }

            function onSaveError () {
                vm.error = 'ERROR';
            }
        }
}) ();