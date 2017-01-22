(function() {
	'use strict';
	angular
	.module('main')
	.factory('CacheService', CacheService);

    function CacheService () {
    	var activeCellar;
    	var selectedWine;
    	var selectedVintage;

    	return {
    		getActiveCellar:getActiveCellar,
    		setActiveCellar:setActiveCellar,
    		getSelectedWine:getSelectedWine,
    		setSelectedWine:setSelectedWine,
    		getSelectedVintage:getSelectedVintage,
    		setSelectedVintage:setSelectedVintage
    	};

    	function getActiveCellar(){
    		return activeCellar;
    	};

    	function setActiveCellar(cellar){
    		activeCellar = cellar;
    	};

		function getSelectedWine(){
			return selectedWine;
		};

		function setSelectedWine(wine){
			selectedWine = wine;
		};

		function getSelectedVintage(){
			return selectedVintage;
		};

		function setSelectedVintage(vintage){
			selectedVintage = vintage;
		};

    };

})();