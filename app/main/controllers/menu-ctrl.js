(function () {
    'use strict';
    angular.module('main')
        .controller('MenuCtrl', function ($log, Auth, $state, Principal, LoginService, CacheService) {
            var vm = this;
            vm.login = LoginService.open;
            vm.isAuthenticated = Principal.isAuthenticated;
            vm.isCellar = isCellar;
            vm.logout = logout;

            function logout () {
                Auth.logout();
                CacheService.removeAll();
                $state.go('home');
            }

            function isCellar(){
                if(CacheService.get('activeCellar')){
                    return true;
                } else {
                    return false;
                }
            }

        });
}) ();