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
			},
			'C':{
				name:'Carbon',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:6,
				disabled:true
			},
			'N':{
				name:'Nitrogen',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:7,
				disabled:true
			},
			'O':{
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
				order:8
			}
	};

	$scope.upgrades = {
				'Tier 1-1':{
					price:1,
					description:"Tier 1 production x2",
					order:0,
					visible:function(){
						return $scope.player.elements[$scope.current_element].upgrades['Tier 1-1'].unlocked;
					},
					apply:function(resource){
						return resource*2;
					}
				},
				'Tier 1-2':{
					price:10,
					description:"Tier 1 production x2",
					order:1,
					visible:function(){
						return $scope.player.elements[$scope.current_element].upgrades['Tier 1-2'].unlocked;
					},
					apply:function(resource){
						return resource*2;
					}
				},
				'Tier 2-1':{
					price:1,
					description:"Tier 2 production x2",
					order:10,
					visible:function(){
						return $scope.player.elements[$scope.current_element].upgrades['Tier 2-1'].unlocked;
					},
					apply:function(resource){
						return resource*2;
					}
				}};
	
	$scope.resources = {
				'H':{ 
					visible:function(){
						return $scope.current_element === "H" &&
								$scope.current_tab == "Elements";
					},
					order:0,
					ratio:0.999884,
					type:'element'
				},
				'H-':{ 
					visible:function(){
						return $scope.current_element === "H" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['H-'].unlocked;;
					},
					order:1,
					html:'H<sup>-</sup>',
					type:'ion',
					charge:+1
				},
				'2H':{ 
					visible:function(){
						return $scope.current_element === "H" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['2H'].unlocked;
					},
					order:2,
					ratio:0.000115,
					html:'<sup>2</sup>H',
					type:'isotope'
				},
				'3H':{ 
					visible:function(){
						return $scope.current_element === "H" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['3H'].unlocked;
					},
					order:4,						
					ratio:0.000001,
					html:'<sup>3</sup>H',
					type:'isotope',
					radioactivity:{
						half_life:3.8852e+8,
						decay_energy:18610,
						decay_type:'beta-',
						decay_product:{'3He+1':1,'e-':1}
					}
				},
				'H2':{ 
					visible:function(){
						return $scope.current_element === "H" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['H2'].unlocked;
					},
					order:5,		
					html:'H<sub>2</sub>',
					type:'allotrope'
				},
				'He':{ 
					visible:function(){
						return $scope.current_element === "He" &&
								$scope.current_tab == "Elements";
					},
					order:100,
					type:'element',
				},
				'3He+1':{ 					
					visible:function(){
						return $scope.current_element === "He" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['3He+1'].unlocked;
					},
					order:101,
					html:'<sup>3</sup>He<sup>+</sup>',
					type:['isotope','ion']
				},
				'C':{ 
					visible:function(){
						return $scope.current_element === "C" &&
								$scope.current_tab == "Elements";
					},
					order:500,
					type:'element',
				},
				'N':{ 
					visible:function(){
						return $scope.current_element === "N" &&
								$scope.current_tab == "Elements";
					},
					order:600,
					type:'element',
				},
				'O':{ 
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements";
					},
					order:700,
					ratio:0.9976,
					type:'element'
				},
				'17O':{ 					
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['17O'].unlocked;
					},
					order:701,
					ratio:0.00039,
					html:'<sup>17</sup>O',
					type:'isotope'
				},
				'18O':{ 						
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['18O'].unlocked;
					},
					order:702,						
					ratio:0.00201 ,
					html:'<sup>18</sup>O',
					type:'isotope'
				},
				'e-':{ 
					visible:function(){
						return $scope.player.resources['e-'].unlocked;
					},
					order:20000,
					type:'subatomic'
				},
				'n':{ 
					visible:function(){
						return $scope.player.resources['n'].unlocked;
					},
					order:20001,
					type:'subatomic'
				},
				'p':{ 
					visible:function(){
						return $scope.player.resources['p'].unlocked;
					},
					order:20002,
					type:'subatomic'
				},
				'energy':{ 
					visible:function(){
						return $scope.player.resources['energy'].unlocked;
					},
					order:20003,
					html:'eV',
					type:'energy'
				}
	};
	
	$scope.radioisotopes = ['3H'];
	
	$scope.tabs = {
			'Elements':{
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
						return $scope.player.unlocks.periodic_table;
					},
					has_new:function(){
						return false;
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
		
	$scope.encyclopedia = {
					'Hydrogen':{
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

	$scope.generators = {
				'Tier 1':{
					order:1,
					visible:function(){
						return true;
					},
					price:15,
					power:1,
					priceIncrease:1.15,
					upgrades:['Tier 1-1','Tier 1-2']
				},
				'Tier 2':{
					order:2,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 1'].level > 0;
					},
					price:100,
					power:5,
					priceIncrease:1.15
				},
				'Tier 3':{
					order:3,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 2'].level > 0;
					},
					price:500,
					power:40,
					priceIncrease:1.15
				},
				'Tier 4':{
					order:4,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 3'].level > 0;
					},
					price:3000,
					power:100,
					priceIncrease:1.15
				},
				'Tier 5':{
					order:5,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 4'].level > 0;
					},
					price:10000,
					power:400,
					priceIncrease:1.15
				},
				'Tier 6':{
					order:6,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 5'].level > 0;
					},
					price:40000,
					power:1000,
					priceIncrease:1.15
				},
				'Tier 7':{
					order:7,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 6'].level > 0;
					},
					price:200000,
					power:4000,
					priceIncrease:1.15
				},
				'Tier 8':{
					order:8,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 7'].level > 0;
					},
					price:1666666,
					power:66666,
					priceIncrease:1.15
				},
				'Tier 9':{
					order:9,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 8'].level > 0;
					},
					price:123456789,
					power:987654,
					priceIncrease:1.15
				},
				'Tier 10':{
					order:10,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 9'].level > 0;
					},
					price:3999999999,
					power:9999999,
					priceIncrease:1.15
				},
				'Tier 11':{
					order:11,
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 10'].level > 0;
					},
					price:75000000000,
					power:100000000,
					priceIncrease:1.15
				}
	};
	
	$scope.reactions = {
		'H':{
			'ionization':[
				{
					reactant:{
						'energy':13.5984,
						'H':1
					},
					product:{
						'p':1,
						'e-':1
					}
				}
			],
			'electron_affinity':[
				{
					reactant:{
						'e-':1,
						'H':1
					},
					product:{
						'H-':1,
						'energy':0.7545
					}
				}
			],
			'binding_energy':[
				{
					reactant:{
						'energy':2224520,
						'2H':1
					},
					product:{
						'p':1,
						'n':1,
						'e-':1
					}
				},
				{
					reactant:{
						'energy':2827266,
						'3H':1
					},
					product:{
						'p':1,
						'n':2,
						'e-':1
					}
				}
			],
			'synthesis':[
				'H-p'
			]
		}
	};
	
	$scope.synthesis = {
		'H-p':{
			reactant:{
				'H-':1,
				'p':1
			},
			product:{
				'H2':1,
				'energy':17.3705
			}
		}
	};	
	
	$scope.html = {
		'beta-':'&#946;<sup>-</sup>'
	};
	
	$scope.periodic_table =[ 
	['H','','','','','','','','','','','','','','','','','He'],
	['Li','Be','','','','','','','','','','','B','C','N','O','F','Ne']
	];
}
