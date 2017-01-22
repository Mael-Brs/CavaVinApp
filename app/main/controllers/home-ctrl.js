'use strict';
angular.module('main')
    .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$rootScope', 'Auth', '$state', 'Principal', 'LoginService', '$ionicModal', 'User', 'CacheService'];

    function HomeCtrl($scope, $rootScope, Auth, $state, Principal, LoginService, $ionicModal, User, CacheService) {
        var vm = this;
        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.logout = logout;
        vm.register = register;
        vm.cellar;
        vm.openModal = openModal;
        $rootScope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
                if (account){
                    User.cellars({login:account.login},function(cellar){
                        vm.cellar = cellar;
                        if(vm.cellar){
                            CacheService.setActiveCellar(cellar);
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
            Cellar.save(vm.cellar, onSaveSuccess, onSaveError);
        }

        function onSaveSuccess () {
            vm.success = 'OK';
        }

         function onSaveError () {
            vm.error = 'ERROR';
        }
    };
