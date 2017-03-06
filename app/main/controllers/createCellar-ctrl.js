(function() {
    'use strict';

    angular
        .module('main')
        .controller('CreateCellarController', CreateCellarController);


    CreateCellarController.$inject = ['$translate', '$timeout','Cellar'];

    function CreateCellarController ($translate, $timeout, Cellar) {				

		function saveCellar(){
            Cellar.save(vm.cellar, onSaveSuccess, onSaveError);
        }

        function onSaveSuccess () {
            vm.success = 'OK';
        }

         function onSaveError () {
            vm.error = 'ERROR';
        }

     }
 })();