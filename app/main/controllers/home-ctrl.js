'use strict';
angular.module('main')
    .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$state', 'Principal', 'LoginService', '$ionicModal', 'User', 'CacheService', 'Cellar'];

    function HomeCtrl($scope, $rootScope, Auth, $state, Principal, LoginService, $ionicModal, User, CacheService, Cellar) {
        var vm = this;
        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.logout = logout;
        vm.register = register;
        vm.cellar;
        vm.openModal = openModal;
        vm.save = saveCellar;

        $rootScope.$on('authenticationSuccess', function() {
            getAccount();
        });

        $scope.$on('$ionicView.enter', function() { 
            getCellarDetails();
        });

        function getCellarDetails() {
            vm.cellar = CacheService.get('activeCellar');
            if(vm.cellar){
                vm.sum = vm.cellar.sumOfWine !== null ? vm.cellar.sumOfWine : 0;
                vm.wineByRegion = vm.cellar.wineByRegion;
                vm.wineByColor = vm.cellar.wineByColor;
            } else {
                getAccount();
            }
        }

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
                if (account){
                    User.cellars({login:account.login},function(cellar){
                        vm.cellar = cellar;
                        if(vm.cellar){
                            vm.sum = cellar.sumOfWine !== null ? cellar.sumOfWine : 0;
                            CacheService.put('activeCellar',cellar);
                        }
                    });
                }
            });
        }

        function register () {
            $state.go('register');
        }

        function logout () {
            Auth.logout();
            $state.go('home');
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
            vm.cellar.userLogin = vm.account.login;
            Cellar.save(vm.cellar, onSaveSuccess, onSaveError);
        }

        function onSaveSuccess () {
            vm.success = 'OK';
            vm.modal.hide();
            getAccount();
        }

         function onSaveError () {
            vm.error = 'ERROR';
        }
    }
