angular.module('incremental',[])
.controller('IncCtrl',['$scope','$document','$interval', '$sce', '$filter', '$timeout', '$log',
function($scope,$document,$interval,$sce,$filter,$timeout,$log) { 
		$scope.version = '0.0';
		$scope.Math = window.Math;
		$scope.log = $log;
		
		const startPlayer = {
			unlocks: [
				'isotopes'
			],
			encyclopedia: {
				'Hydrogen':{is_new:true}
			},
			elements: {
				'H':{
					generators: [{level:5,
							visible:function(){
								return true;
							}},							
							{level:1,
							visible:function(){
								return $scope.player.elements.H.generators[0].level > 0;
							}},
							{level:3,
							visible:function(){
								return $scope.player.elements.H.generators[1].level > 0;
							}},
							{level:1,
							visible:function(){
								return $scope.player.elements.H.generators[2].level > 0;
							}},
							{level:2,
							visible:function(){
								return $scope.player.elements.H.generators[3].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.H.generators[4].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.H.generators[5].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.H.generators[6].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.H.generators[7].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.H.generators[8].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.H.generators[9].level > 0;
							}}],
					upgrades:{
						'Upgrade 1':{
							unlocked:true,
							bought:true
						},
						'Upgrade 2':{
							unlocked:true,
							bought:false
						},
						'Upgrade 3':{
							unlocked:false,
							bought:false
						},
						unlocked: true
					},
					unlocked:true
				},'O':{
					generators: [
							{level:15,
							visible:function(){
								return true;
							}},							
							{level:1,
							visible:function(){
								return $scope.player.elements.O.generators[0].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[1].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[2].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[3].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[4].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[5].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[6].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[7].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[8].level > 0;
							}},
							{level:0,
							visible:function(){
								return $scope.player.elements.O.generators[9].level > 0;
							}}],
					upgrades:{
						'Upgrade 1':{
							unlocked:true,
							bought:true
						},
						'Upgrade 2':{
							unlocked:false,
							bought:false
						},
						'Upgrade 3':{
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
						number:1.523e25,
						is_new:false,
						visible:function(){
							return $scope.current_element === "H";
						},
						order:0,
						unlocked: true
					},
					'2H':{ 
						number:100000000,
						is_new:true,
						visible:function(){
							return $scope.current_element === "H";
						},
						order:1,
						unlocked: true
					},
					'3H':{ 
						number:1000000000,
						is_new:true,
						visible:function(){
							return $scope.current_element === "H";
						},
						order:2,		
						unlocked: true
					},
					'O':{ 
						number:0,
						is_new:false,
						visible:function(){
							return $scope.current_element === "O";
						},
						order:700,
						unlocked: true
					},
					'17O':{ 
						number:345,
						is_new:true,						
						visible:function(){
							return $scope.current_element === "O";
						},
						order:701,
						unlocked: true
					},
					'18O':{ 
						number:36236,
						is_new:true,						
						visible:function(){
							return $scope.current_element === "O";
						},
						order:702,			
						unlocked: true
					},
					'e-':{ 
						number:10,
						is_new:false,
						visible:function(){
							return $scope.player.resources['e-'].unlocked;
						},
						order:20000,
						unlocked: false
					},
					'n':{ 
						number:0,
						is_new:true,
						visible:function(){
							return true;
						},
						order:20001,
						unlocked: true
					},
					'p':{ 
						number:0,
						is_new:false,
						visible:function(){
							return true;
						},
						order:20002,
						unlocked: true
					},
					'energy':{ 
						number:0,
						is_new:false,
						visible:function(){
							return true;
						},
						order:20003,
						unlocked: true
					}
				}
			};
		
		$scope.elements = {
				'H':{
					name:'Hydrogen',
					isotopes:['2H','3H'],
					visible:function(){
							return $scope.player.elements.H.unlocked;
						},
					has_new:function(){
							return $scope.player.resources['H'].is_new ||
									$scope.player.resources['2H'].is_new ||
									$scope.player.resources['3H'].is_new;
						},
					order:1
				},'O':{
					name:'Oxygen',
					isotopes:['17O','18O'],
					visible:function(){
							return $scope.player.elements.O.unlocked;
						},
					has_new:function(){
							return $scope.player.resources['O'].is_new ||
									$scope.player.resources['17O'].is_new ||
									$scope.player.resources['18O'].is_new;
						},
					order:7
				}
		};
		
		$scope.upgrades = {
					'Upgrade 1':{
						price:1,
						description:"Do this and that",
						order:0,
						visible:function(){
							return $scope.player.elements[$scope.current_element].upgrades['Upgrade 1'].unlocked;
						}
					},
					'Upgrade 2':{
						price:10,
						description:"Do this and that",
						order:1,
						visible:function(){
							return $scope.player.elements[$scope.current_element].upgrades['Upgrade 2'].unlocked;
						}
					},
					'Upgrade 3':{
						price:100,
						description:"Do this and that",
						order:2,
						visible:function(){
							return $scope.player.elements[$scope.current_element].upgrades['Upgrade 3'].unlocked;
						}
					}};
		
		$scope.resources = {
					'H':{ 
						visible:function(){
							return $scope.current_element === "H";
						},
						order:0,
						ratio:0.999884,
						type:'element'
					},
					'2H':{ 
						visible:function(){
							return $scope.current_element === "H";
						},
						order:1,
						ratio:0.000115,
						type:'isotope'
					},
					'3H':{ 
						visible:function(){
							return $scope.current_element === "H";
						},
						order:2,						
						ratio:0.000001,
						type:'isotope'
					},
					'O':{ 
						visible:function(){
							return $scope.current_element === "O";
						},
						order:700,
						ratio:0.9976,
						type:'element'
					},
					'17O':{ 					
						visible:function(){
							return $scope.current_element === "O";
						},
						order:701,
						ratio:0.00039,
						type:'isotope'
					},
					'18O':{ 						
						visible:function(){
							return $scope.current_element === "O";
						},
						order:702,						
						ratio:0.00201 ,
						type:'isotope'
					},
					'e-':{ 
						visible:function(){
							return true;
						},
						order:20000,
						type:'subatomic'
					},
					'n':{ 
						visible:function(){
							return true;
						},
						order:20001,
						type:'subatomic'
					},
					'p':{ 
						visible:function(){
							return true;
						},
						order:20002,
						type:'subatomic'
					},
					'energy':{ 
						visible:function(){
							return true;
						},
						order:20003,
						type:'energy'
					}
		};
		
		$scope.tabs = {'Elements':{
						visible:function(){
							return true;
						},
						has_new:false,
						order:0},
				'Encyclopedia':{
						visible:function(){
							return true;
						},
						has_new:true,
						order:1},
				'Periodic Table':{
						visible:function(){
							return false;
						},
						has_new:false,
						order:2},
				'Options':{
						visible:function(){
							return true;
						},
						has_new:false,
						order:3}
			};
			
		$scope.encyclopedia = {'Hydrogen':{
							visible:function(){
								return true;
							},
							order:0,
							link:'https://en.wikipedia.org/wiki/Hydrogen',
							description:'<b>Hydrogen</b> is a chemical element with chemical symbol <b>H</b> and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass. Non-remnant stars are mainly composed of hydrogen in its plasma state. The most common isotope of hydrogen, termed protium, has one proton and no neutrons.'
							}
		};
			
		var resourceHTML = {
					'2H':'<sup>2</sup>H',
					'3H':'<sup>3</sup>H',
					'17O':'<sup>17</sup>O',
					'18O':'<sup>18</sup>O',
					'energy':'KeV'
		};
		
		$scope.generators = [
					{name:'Tier 1',
					price:15,
					power:0.1,
					priceIncrease:1.15
					},
					{name:'Tier 2',
					price:100,
					power:0.5,
					priceIncrease:1.15
					},
					{name:'Tier 3',
					price:500,
					power:4,
					priceIncrease:1.15
					},
					{name:'Tier 4',
					price:3000,
					power:10,
					priceIncrease:1.15
					},
					{name:'Tier 5',
					price:10000,
					power:40,
					priceIncrease:1.15
					},
					{name:'Tier 6',
					price:40000,
					power:100,
					priceIncrease:1.15
					},
					{name:'Tier 7',
					price:200000,
					power:400,
					priceIncrease:1.15
					},
					{name:'Tier 8',
					price:1666666,
					power:6666,
					priceIncrease:1.15
					},
					{name:'Tier 9',
					price:123456789,
					power:98765,
					priceIncrease:1.15
					},
					{name:'Tier 10',
					price:3999999999,
					power:999999,
					priceIncrease:1.15
					},
					{name:'Tier 11',
					price:75000000000,
					power:10000000,
					priceIncrease:1.15
					}
		];
		
		cache = {};
		$scope.current_tab = "Elements";
		$scope.current_entry = "Hydrogen";
		$scope.current_element = "H";

		$scope.generatorPrice = function(index,level) {
			var price = $scope.generators[index].price*Math.pow($scope.generators[index].priceIncrease,level);
			return Math.ceil(price);
		};
		
		$scope.getHTML = function(resource) {
			var html = resourceHTML[resource];
			if(html == null) return resource;
			return html;
		};
		
		$scope.isCostMet = function(element, index) {return false;};

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
				if(table[objectKey].visible()){
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
		
        $scope.buyGenerator = function(number) {
        /*
            if ($scope.player.h >= $scope.player.hGeneratorPrice[number]) {
                $scope.player.h -= $scope.player.hGeneratorPrice[number];
                $scope.player.hGeneratorLevel[number]++;
				$scope.player.hGeneratorPrice[number] = hGeneratorBasePrice[number]*Math.pow(priceIncrease,$scope.player.hGeneratorLevel[number]);
				refreshUpgradeLine(number, true);
            }
            */
        };

		$scope.updateCurrentElement = function(new_value) {
			$scope.current_element = new_value;
		};		
		
		$scope.updateCurrentTab = function(new_value) {
			$scope.current_tab = new_value;
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
            $scope.player.resources["2H"].number++;
        };
        
		$scope.prettifyNumber = function(number){
			if(typeof number == 'undefined'){
				return;
			}
				
			if(number == Infinity){
				return "&infin;";
			}
			if(number > 1e8){
				// Very ugly way to extract the mantisa and exponent from an exponential string
				var exponential = number.toExponential().split("e");
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
