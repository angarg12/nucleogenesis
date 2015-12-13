angular.module('incremental',[])
.controller('IncCtrl',['$scope','$document','$interval', '$sce', '$filter', '$timeout', '$log',
function($scope,$document,$interval,$sce,$filter,$timeout,$log) { 
		$scope.version = '0.0';
		$scope.Math = window.Math;
		$scope.log = $log;
		
		const startPlayer = {
			unlocks: {
				isotopes:true,
				decay:true,
				periodic_table:true
			},
			encyclopedia: {
				'Hydrogen':{is_new:true},				
				'Isotope':{is_new:true}
			},
			elements_unlocked:2,
			elements: {
				'H':{
					generators: {
							'Tier 1':{level:1},							
							'Tier 2':{level:1},
							'Tier 3':{level:1},
							'Tier 4':{level:100000000000},
							'Tier 5':{level:0},
							'Tier 6':{level:0},
							'Tier 7':{level:0},
							'Tier 8':{level:0},
							'Tier 9':{level:0},
							'Tier 10':{level:0},
							'Tier 11':{level:0}
					},
					upgrades:{
						'Tier 1-1':{
							unlocked:true,
							bought:true
						},
						'Tier 1-2':{
							unlocked:true,
							bought:false
						},
						'Tier 2-1':{
							unlocked:false,
							bought:false
						},
						unlocked: true
					},
					unlocked:true
				},'O':{					
					generators: {
							'Tier 1':{level:15},							
							'Tier 2':{level:1},
							'Tier 3':{level:0},
							'Tier 4':{level:0},
							'Tier 5':{level:0},
							'Tier 6':{level:0},
							'Tier 7':{level:0},
							'Tier 8':{level:0},
							'Tier 9':{level:0},
							'Tier 10':{level:0},
							'Tier 11':{level:0}
					},
					upgrades:{
						'Tier 1-1':{
							unlocked:true,
							bought:true
						},
						'Tier 1-2':{
							unlocked:false,
							bought:false
						},
						'Tier 2-1':{
							unlocked:false,
							bought:false
						},
						unlocked: true
					},
					unlocked:true
				}
			},
			resources:{
					'H':{ 
						number:0,
						is_new:false,
						unlocked: true
					},
					'2H':{ 
						number:0,
						is_new:true,
						unlocked: true
					},
					'3H':{ 
						number:0,
						is_new:true,		
						unlocked: true
					},
					'O':{ 
						number:0,
						is_new:false,
						unlocked: true
					},
					'17O':{ 
						number:345,
						is_new:true,	
						unlocked: true
					},
					'18O':{ 
						number:36236,
						is_new:true,			
						unlocked: true
					},
					'e-':{ 
						number:1000,
						is_new:false,
						unlocked: true
					},
					'n':{ 
						number:1000,
						is_new:true,
						unlocked: false
					},
					'p':{ 
						number:1000,
						is_new:false,
						unlocked: true
					},
					'energy':{ 
						number:0,
						is_new:false,
						unlocked: true
					}
				}
			};
		
		cache = {};
		$scope.current_tab = "Elements";
		$scope.current_entry = "Hydrogen";
		$scope.current_element = "H";
		$scope.hover_element = "";
        var numberGenerator = new Ziggurat();

		$scope.elementPrice = function(element) {
			return Math.pow($scope.player.elements_unlocked+1,$scope.resources[element].number);
		};
		
		$scope.isElementCostMet = function(element) {
			var price = $scope.elementPrice(element);
			return $scope.player.resources['e-'].number >= price &&
					$scope.player.resources['p'].number >= price &&
					$scope.player.resources['n'].number >= price;
		};

		$scope.generatorPrice = function(name, element) {
			var level = $scope.player.elements[element].generators[name].level;
			var price = $scope.generators[name].price*Math.pow($scope.generators[name].priceIncrease, level);
			return Math.ceil(price);
		};
		
		$scope.getHTML = function(resource) {		
			var html = $scope.html[resource];
			if(html == null) html = $scope.resources[resource].html;
			if(html == null) return resource;
			return html;
		};

		/*
			Values is a list or map of values that we want to filter and order.
			Table is the map that contains the information of order and visibility.
		*/
		$scope.filterAndOrder = function(values, table) {	
			if(values == undefined) return;
			hash = JSON.stringify(values).hashCode();
			if(cache[hash] != null){
				return cache[hash];
			}	
			var array = [];
			for(var objectKey in values) {
				if(Array.isArray(values)){
					objectKey = values[objectKey];
				}
				if(objectKey in table && table[objectKey].visible()){
					var object = {};
					object.name = objectKey;
					object.value = values[objectKey];
					array.push(object);
				}
			}
			array.sort(function(a, b){
				n = parseInt(table[a.name].order);
				m = parseInt(table[b.name].order);
				return n - m;
			});
			cache[hash] = array;
			return array;
		};
		
        $scope.buyGenerator = function(name, element) {
        	var price = $scope.generatorPrice(name, element);
            if ($scope.player.resources[element].number >= price) {
                $scope.player.resources[element].number -= price;
                $scope.player.elements[element].generators[name].level++;
            }
        };
        
        $scope.buyUpgrade = function(name, element) {
        	var price = $scope.upgrades[name].price;
            if ($scope.player.resources[element].number >= price) {
                $scope.player.resources[element].number -= price;
                $scope.player.elements[element].upgrades[name].bought = true;
            }
        };
        
        $scope.buyElement = function(element) {
        	if($scope.isElementCostMet(element)){
        		var price = $scope.elementPrice(element);
				$scope.player.resources['e-'].number -= price;
				$scope.player.resources['p'].number -= price;
				$scope.player.resources['n'].number -= price;
				$scope.player.elements[element].unlocked = true;
				$scope.player.elements_unlocked++;
        	}
        };

		$scope.tierProduction = function(name, element) {
			var baseProduction = $scope.generators[name].power*$scope.player.elements[element].generators[name].level;
			var upgradedProduction = baseProduction;
			for(var upgrade in $scope.generators[name].upgrades){
				if($scope.player.elements[element].upgrades[$scope.generators[name].upgrades[upgrade]].bought){
					upgradedProduction = $scope.upgrades[$scope.generators[name].upgrades[upgrade]].apply(upgradedProduction);
				}
			}
			return upgradedProduction;
		};
		
		$scope.elementProduction = function(element) {
			var total = 0;
			for(var tier in $scope.generators){
				total += $scope.tierProduction(tier, element);
			}
			return total;
		};
		
		$scope.updateCurrent = function(variable, new_value) {
			$scope[variable] = new_value;
		};	

		$scope.save = function() {
			localStorage.setItem("playerStored", JSON.stringify($scope.player));
			var d = new Date();
			$scope.lastSave = d.toLocaleTimeString();
		};
		
		$scope.load = function() {
			try {
				$scope.player = JSON.parse(localStorage.getItem("playerStored"));
				$scope.currentPrestige = parseInt(localStorage.getItem("currentPrestige"));

			}catch(err){
				alert("Error loading savegame, reset forced.");
				$scope.reset(false);
			}
			versionControl();
		};
		
		$scope.reset = function(ask) {
			var confirmation = true;
			if(ask){
				confirmation = confirm("Are you sure you want to reset? This will permanently erase your progress.");
			}
			
			if(confirmation === true){
				init();
				localStorage.removeItem("playerStored");
			}
		};
		
		function versionControl() {
            
        };
		
        function update() {
            // We will simulate the production of isotopes proportional to their ratio
            for(var element in $scope.player.elements){
            	// Prepare an array with the isotopes
            	var isotopes = [element];
            	isotopes = isotopes.concat($scope.elements[element].isotopes);
            	// N is the total production for this element
            	var N = $scope.elementProduction(element);
            	var remaning_N = N;
            	// We will create a random draw from a Gaussian with mean N*p and std
            	// based on a binomial
            	// On each consecutive draw we subtract the number generated to the total and
            	// recalculate the mean and std
            	for(var i = 0; i < isotopes.length-1; i++){
            		// First we need to adjust the ratio for the remaning isotopes 
            		var remaining_ratio_sum = 0;
            		for(var j = i; j < isotopes.length; j++){
            			remaining_ratio_sum += $scope.resources[isotopes[j]].ratio;
            		}
            		
		        	var p = $scope.resources[isotopes[i]].ratio/remaining_ratio_sum;
		        	var q = 1-p;
		        	var mean = remaning_N*p;
		        	var variance = remaning_N*p*q;
		        	var std = Math.sqrt(variance);
		        	production = Math.round(numberGenerator.nextGaussian()*std+mean);
		        	if(production > remaning_N){
		        		production = remaning_N;
		        	}
		        	if(production < 0){
		        		production = 0;
		        	}
		        	$scope.player.resources[isotopes[i]].number += production;
		        	remaning_N -= production;
            	}
            	// The last isotope is just the remaining production that hasn't been consumed
            	$scope.player.resources[isotopes[isotopes.length-1]].number += remaning_N;
            }
        };
        
        $scope.decayFormat = function(radioactivity) {
        	var format = '<span class="icon">&#8594;</span>';
        	for (var i = 0; i < radioactivity.decay_product.length; i++) {
        		format += $scope.getHTML(radioactivity.decay_product[i])+"+";
        	}
        	format += $scope.prettifyNumber(radioactivity.decay_energy)+' '+$scope.getHTML('energy');
        	return format;
        }
        
		$scope.prettifyNumber = function(number){
			if(typeof number == 'undefined'){
				return;
			}
				
			if(number == Infinity){
				return "&infin;";
			}
			if(number > 1e8){
				// Very ugly way to extract the mantisa and exponent from an exponential string
				var exponential = number.toPrecision(8).split("e");
				var exponent = parseFloat(exponential[1].split("+")[1]);
				// And it is displayed in with superscript
				if(exponential[0] == "1"){
					return  "10<sup>"+$scope.prettifyNumber(exponent)+"</sup>";							
				}
				return  $filter('number')(exponential[0])+" &#215; 10<sup>"+$scope.prettifyNumber(exponent)+"</sup>";						
			}
			return $filter('number')(number);
		};   
		
		function init(){
			$scope.player = angular.copy(startPlayer);
		};
				
		$timeout(function(){
			if(localStorage.getItem("playerStored") !== null){
				$scope.load();
			}
			if(typeof $scope.player  === 'undefined'){
				init();
			}
			if(typeof $scope.lastSave  === 'undefined'){
				$scope.lastSave = "None";
			}
			loadData($scope);
			init();
            $interval(update,1000);
            $interval($scope.save,60000);
        });	
        
        $scope.trustHTML = function(html) {
               return $sce.trustAsHtml(html);
        };
        
        String.prototype.hashCode = function() {
		  var hash = 0, i, chr, len;
		  if (this.length == 0) return hash;
		  for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		  }
		  return hash;
		};
}]);
