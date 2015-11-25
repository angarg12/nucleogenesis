function loadData($scope) {
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
					html:'<sup>2</sup>H',
					type:'isotope'
				},
				'3H':{ 
					visible:function(){
						return $scope.current_element === "H";
					},
					order:2,						
					ratio:0.000001,
					html:'<sup>3</sup>H',
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
					html:'<sup>17</sup>O',
					type:'isotope'
				},
				'18O':{ 						
					visible:function(){
						return $scope.current_element === "O";
					},
					order:702,						
					ratio:0.00201 ,
					html:'<sup>18</sup>O',
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
					html:'KeV',
					type:'energy'
				}
	};
	
	$scope.tabs = {'Elements':{
					visible:function(){
						return true;
					},
					has_new:function(){
						for(var key in $scope.elements){
							if($scope.elements[key].has_new()){
								return true;
							}
						}
						var other = ['e-','n','p','energy'];
						for(var key in other){
							if($scope.player.resources[other[key]].is_new){
								return true;
							}
						}
						return false;
					},
					order:0},
			'Encyclopedia':{
					visible:function(){
						return true;
					},
					has_new:function(){						
						for(var key in $scope.player.encyclopedia){
							if($scope.player.encyclopedia[key].is_new){
								return true;
							}
						}
					
						return false;
					},
					order:1},
			'Periodic Table':{
					visible:function(){
						return false;
					},
					has_new:function(){
						return true;
					},
					order:2},
			'Options':{
					visible:function(){
						return true;
					},
					has_new:function(){
						return false;
					},
					order:3}
		};
		
	$scope.encyclopedia = {'Hydrogen':{
						visible:function(){
							return true;
						},
						order:0,
						link:'https://en.wikipedia.org/wiki/Hydrogen',
						description:'<b>Hydrogen</b> is a chemical element with chemical symbol <b>H</b> and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass. Non-remnant stars are mainly composed of hydrogen in its plasma state. The most common isotope of hydrogen, termed protium, has one proton and no neutrons.'
						},
						'Isotope':{
						visible:function(){
							return $scope.player.unlocks.isotopes;
						},
						order:1,
						link:'https://en.wikipedia.org/wiki/Isotope',
						description:'<b>Isotopes</b> are variants of a particular chemical element which differ in neutron number, although all isotopes of a given element have the same number of protons in each atom. The term isotope is formed from the Greek roots isos (ἴσος "equal") and topos (τόπος "place"), meaning "the same place"; thus, the meaning behind the name it is that different isotopes of a single element occupy the same position on the periodic table. The number of protons within the atom\'s nucleus is called atomic number and is equal to the number of electrons in the neutral (non-ionized) atom. Each atomic number identifies a specific element, but not the isotope; an atom of a given element may have a wide range in its number of neutrons. The number of nucleons (both protons and neutrons) in the nucleus is the atom\'s mass number, and each isotope of a given element has a different mass number.'
						}
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
}
