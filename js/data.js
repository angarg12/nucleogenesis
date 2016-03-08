function loadData($scope) {
	$scope.elements = {
			'H':{
				name:'Hydrogen',
				isotopes:['2H','3H'],				
				visible:function(){
						return $scope.player.elements.H.unlocked;
					},
				has_new:function(){
						var includes = ['H','2H','3H','H-','H2'];
						for(key in includes){
							if($scope.player.resources[includes[key]].unlocked &&
								$scope.player.resources[includes[key]].is_new){
								return true;
							}
						}
						return false;
					},
				order:1
			},
			'He':{
				name:'Helium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:2,
				disabled:true
			},
			'Li':{
				name:'Lithium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:3,
				disabled:true
			},
			'Be':{
				name:'Beryllium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:4,
				disabled:true
			},
			'B':{
				name:'Boron',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:5,
				disabled:true
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
						var includes = ['O','17O','18O','O2','O3'];
						for(key in includes){
							if($scope.player.resources[includes[key]].unlocked &&
								$scope.player.resources[includes[key]].is_new){
								return true;
							}
						}
						return false;
					},
				order:8
			},
			'F':{
				name:'Fluorine',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:9,
				disabled:true
			},
			'Ne':{
				name:'Neon',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:10,
				disabled:true
			},
			'Na':{
				name:'Sodium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:11,
				disabled:true
			},
			'Mg':{
				name:'Magnesium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:12,
				disabled:true
			},
			'Al':{
				name:'Aluminium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:13,
				disabled:true
			},
			'Si':{
				name:'Silicon',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:14,
				disabled:true
			},
			'P':{
				name:'Phosphorus',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:15,
				disabled:true
			},
			'S':{
				name:'Sulfur',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:16,
				disabled:true
			},
			'Cl':{
				name:'Chlorine',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:17,
				disabled:true
			},
			'Ar':{
				name:'Argon',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:18,
				disabled:true
			},
			'K':{
				name:'Potassium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:19,
				disabled:true
			},
			'Ca':{
				name:'Calcium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:20,
				disabled:true
			},
			'Sc':{
				name:'Scandium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:21,
				disabled:true
			},
			'Ti':{
				name:'Titanium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:22,
				disabled:true
			},
			'V':{
				name:'Vanadium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:23,
				disabled:true
			},
			'Cr':{
				name:'Chromium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:24,
				disabled:true
			},
			'Mn':{
				name:'Manganese',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:25,
				disabled:true
			},
			'Fe':{
				name:'Iron',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:26,
				disabled:true
			},
			'Co':{
				name:'Cobalt',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:27,
				disabled:true
			},
			'Ni':{
				name:'Nickel',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:28,
				disabled:true
			},
			'Cu':{
				name:'Copper',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:29,
				disabled:true
			},
			'Zn':{
				name:'Zinc',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:30,
				disabled:true
			},
			'Ga':{
				name:'Gallium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:31,
				disabled:true
			},
			'Ge':{
				name:'Germanium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:32,
				disabled:true
			},
			'As':{
				name:'Arsenic',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:33,
				disabled:true
			},
			'Se':{
				name:'Selenium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:34,
				disabled:true
			},
			'Br':{
				name:'Bromine',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:35,
				disabled:true
			},
			'Kr':{
				name:'Krypton',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:36,
				disabled:true
			},
			'Rb':{
				name:'Rubidium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:37,
				disabled:true
			},
			'Sr':{
				name:'Strontium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:38,
				disabled:true
			},
			'Y':{
				name:'Yttrium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:39,
				disabled:true
			},
			'Zr':{
				name:'Zirconium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:40,
				disabled:true
			},
			'Nb':{
				name:'Niobium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:41,
				disabled:true
			},
			'Mo':{
				name:'Molybdenum',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:42,
				disabled:true
			},
			'Tc':{
				name:'Technetium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:43,
				disabled:true
			},
			'Ru':{
				name:'Ruthenium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:44,
				disabled:true
			},
			'Rh':{
				name:'Rhodium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:45,
				disabled:true
			},
			'Pd':{
				name:'Palladium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:46,
				disabled:true
			},
			'Ag':{
				name:'Silver',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:47,
				disabled:true
			},
			'Cd':{
				name:'Cadmium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:48,
				disabled:true
			},
			'In':{
				name:'Indium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:49,
				disabled:true
			},
			'Sn':{
				name:'Tin',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:50,
				disabled:true
			},
			'Sb':{
				name:'Antimony',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:51,
				disabled:true
			},
			'Te':{
				name:'Tellurium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:52,
				disabled:true
			},
			'I':{
				name:'Iodine',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:53,
				disabled:true
			},
			'Xe':{
				name:'Xenon',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:54,
				disabled:true
			},
			'Cs':{
				name:'Caesium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:55,
				disabled:true
			},
			'Ba':{
				name:'Barium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:56,
				disabled:true
			},
			'La':{
				name:'Lanthanum',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:57,
				disabled:true
			},
			'Ce':{
				name:'Cerium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:58,
				disabled:true
			},
			'Pr':{
				name:'Praseodymium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:59,
				disabled:true
			},
			'Nd':{
				name:'Neodymium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:60,
				disabled:true
			},
			'Pm':{
				name:'Promethium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:61,
				disabled:true
			},
			'Sm':{
				name:'Samarium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:62,
				disabled:true
			},
			'Eu':{
				name:'Europium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:63,
				disabled:true
			},
			'Gd':{
				name:'Gadolinium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:64,
				disabled:true
			},
			'Tb':{
				name:'Terbium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:65,
				disabled:true
			},
			'Dy':{
				name:'Dysprosium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:66,
				disabled:true
			},
			'Ho':{
				name:'Holmium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:67,
				disabled:true
			},
			'Er':{
				name:'Erbium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:68,
				disabled:true
			},
			'Tm':{
				name:'Thulium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:69,
				disabled:true
			},
			'Yb':{
				name:'Ytterbium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:70,
				disabled:true
			},
			'Lu':{
				name:'Lutetium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:71,
				disabled:true
			},
			'Hf':{
				name:'Hafnium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:72,
				disabled:true
			},
			'Ta':{
				name:'Tantalum',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:73,
				disabled:true
			},
			'W':{
				name:'Tungsten',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:74,
				disabled:true
			},
			'Re':{
				name:'Rhenium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:75,
				disabled:true
			},
			'Os':{
				name:'Osmium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:76,
				disabled:true
			},
			'Ir':{
				name:'Iridium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:77,
				disabled:true
			},
			'Pt':{
				name:'Platinum',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:78,
				disabled:true
			},
			'Au':{
				name:'Gold',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:79,
				disabled:true
			},
			'Hg':{
				name:'Mercury',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:80,
				disabled:true
			},
			'Tl':{
				name:'Thallium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:81,
				disabled:true
			},
			'Pb':{
				name:'Lead',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:82,
				disabled:true
			},
			'Bi':{
				name:'Bismuth',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:83,
				disabled:true
			},
			'Po':{
				name:'Polonium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:84,
				disabled:true
			},
			'At':{
				name:'Astatine',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:85,
				disabled:true
			},
			'Rn':{
				name:'Radon',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:86,
				disabled:true
			},
			'Fr':{
				name:'Francium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:87,
				disabled:true
			},
			'Ra':{
				name:'Radium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:88,
				disabled:true
			},
			'Ac':{
				name:'Actinium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:89,
				disabled:true
			},
			'Th':{
				name:'Thorium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:90,
				disabled:true
			},
			'Pa':{
				name:'Protactinium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:91,
				disabled:true
			},
			'U':{
				name:'Uranium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:92,
				disabled:true
			},
			'Np':{
				name:'Neptunium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:93,
				disabled:true
			},
			'Pu':{
				name:'Plutonium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:94,
				disabled:true
			},
			'Am':{
				name:'Americium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:95,
				disabled:true
			},
			'Cm':{
				name:'Curium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:96,
				disabled:true
			},
			'Bk':{
				name:'Berkelium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:97,
				disabled:true
			},
			'Cf':{
				name:'Californium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:98,
				disabled:true
			},
			'Es':{
				name:'Einsteinium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:99,
				disabled:true
			},
			'Fm':{
				name:'Fermium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:100,
				disabled:true
			},
			'Md':{
				name:'Mendelevium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:101,
				disabled:true
			},
			'No':{
				name:'Nobelium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:102,
				disabled:true
			},
			'Lr':{
				name:'Lawrencium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:103,
				disabled:true
			},
			'Rf':{
				name:'Rutherfordium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:104,
				disabled:true
			},
			'Db':{
				name:'Dubnium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:105,
				disabled:true
			},
			'Sg':{
				name:'Seaborgium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:106,
				disabled:true
			},
			'Bh':{
				name:'Bohrium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:107,
				disabled:true
			},
			'Hs':{
				name:'Hassium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:108,
				disabled:true
			},
			'Mt':{
				name:'Meitnerium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:109,
				disabled:true
			},
			'Ds':{
				name:'Darmstadtium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:110,
				disabled:true
			},
			'Rg':{
				name:'Roentgenium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:111,
				disabled:true
			},
			'Cn':{
				name:'Copernicium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:112,
				disabled:true
			},
			'Uut':{
				name:'Ununtrium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:113,
				disabled:true
			},
			'Fl':{
				name:'Flerovium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:114,
				disabled:true
			},
			'Uup':{
				name:'Ununpentium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:115,
				disabled:true
			},
			'Lv':{
				name:'Livermorium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:116,
				disabled:true
			},
			'Uus':{
				name:'Ununseptium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:117,
				disabled:true
			},
			'Uuo':{
				name:'Ununoctium',
				isotopes:[],
				visible:function(){
						return false;
					},
				has_new:function(){
						return false;
					},
				order:118,
				disabled:true
			}
	};

	// TODO: create this programatically
	$scope.generators = {
				'Tier 1':{
					visible:function(){
						return true;
					},
					price:15,
					power:1,
					priceIncrease:1.05
				},
				'Tier 2':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 1'].level > 0;
					},
					price:100,
					power:10,
					priceIncrease:1.05
				},
				'Tier 3':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 2'].level > 0;
					},
					price:1100,
					power:80,
					priceIncrease:1.05
				},
				'Tier 4':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 3'].level > 0;
					},
					price:12000,
					power:470,
					priceIncrease:1.05
				},
				'Tier 5':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 4'].level > 0;
					},
					price:130000,
					power:2600,
					priceIncrease:1.05
				},
				'Tier 6':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 5'].level > 0;
					},
					price:1400000,
					power:14000,
					priceIncrease:1.05
				},
				'Tier 7':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 6'].level > 0;
					},
					price:2000000,
					power:78000,
					priceIncrease:1.05
				},
				'Tier 8':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 7'].level > 0;
					},
					price:330000000,
					power:440000,
					priceIncrease:1.05
				},
				'Tier 9':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 8'].level > 0;
					},
					price:5100000000,
					power:2600000,
					priceIncrease:1.05
				},
				'Tier 10':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 9'].level > 0;
					},
					price:75000000000,
					power:16000000,
					priceIncrease:1.05
				},
				'Tier 11':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 10'].level > 0;
					},
					price:1000000000000,
					power:100000000,
					priceIncrease:1.05
				},
				'Tier 12':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 11'].level > 0;
					},
					price:14000000000000,
					power:650000000,
					priceIncrease:1.05
				},
				'Tier 13':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 12'].level > 0;
					},
					price:170000000000000,
					power:4300000000,
					priceIncrease:1.05
				},
				'Tier 14':{
					visible:function(){
						return $scope.player.elements[$scope.current_element].generators['Tier 13'].level > 0;
					},
					price:2100000000000000,
					power:2900000000,
					priceIncrease:1.05
				}
	};

	$scope.upgrades = {};
	
	var upgradePrice = [[100,500,10000,100000,10e6,100e6,1e9,10e9],
					[1000,5000,50000,5e6,500e6,50e9,50e12,50e15],
					[10000,55000,550000,55e6,5.5e9,550e9,550e12,550e15],
					[120000,600000,6e6,600e6,60e9,6e12,6e15,6e18],
					[1.3e6,6.5e6,65e6,6.5e9,650e9,65e12,65e15,65e18],
					[14e6,70e6,700e6,70e9,7e12,700e12,700e15,700e18],
					[200e6,1e9,10e9,1e12,100e12,10e15,10e18,10e21],
					[3.3e9,16.5e9,165e9,16.5e12,1.65e15,165e15,165e18,165e21],
					[51e9,255e9,2.55e12,255e12,25.5e15,2.55e18,2.55e21,2.55e24],
					[750e9,3.75e12,37.5e12,3.75e15,375e15,37.5e18,37.5e21,37.5e24],
					[10e12,50e12,500e12,50e15,5e18,500e18,500e21,500e24],
					[140e12,700e12,7e15,700e15,70e18,7e21,7e24,7e27],
					[1.7e15,8.5e15,85e15,8.5e18,850e18,85e21,85e24,85e27],
					[21e15,105e15,1.05e18,105e18,10.5e21,1.05e24,1.05e27,1.05e30]];
	var upgradePower = [[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9],
						[2,3,4,5,6,7,8,9]];

	for(var i = 0; i < upgradePrice.length; i++){
		$scope.generators["Tier "+(i+1)].upgrades = [];
		for(var j = 0; j < upgradePrice[i].length; j++){
			$scope.generators["Tier "+(i+1)].upgrades.push("Tier "+(i+1)+"-"+(j+1));
			$scope.upgrades["Tier "+(i+1)+"-"+(j+1)] = {
				price:upgradePrice[i][j],
				description:"x"+upgradePower[i][j],
				order:i*upgradePrice.length+j,
				apply:createApply(upgradePower[i][j])
			}
			if(j == 0){
				$scope.upgrades["Tier "+(i+1)+"-"+(j+1)].visible = createIsVisible0(i);
			}else{
				$scope.upgrades["Tier "+(i+1)+"-"+(j+1)].visible = createIsVisible(i,j);
			}			
		}
	}

	function createApply(power) {
		return function(resource){
			return resource*power;
		}
	};
	
	function createIsVisible0(i){
		return function(){
			return $scope.player.unlocks["upgrade"] && 
								$scope.player.elements[$scope.current_element].generators["Tier "+(i+1)].level > 0;
		}
	};
	
	function createIsVisible(i,j){
		return function(){
			return $scope.player.elements[$scope.current_element].upgrades["Tier "+(i+1)+"-"+j].bought;
		}
	};

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
					decay:{
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
				'O':{ 
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements";
					},
					order:700,
					ratio:0.9976,
					type:'element',
					free_radical:{
						reactivity:0.05,
						reaction:[
							{reactant:'O',
							product:'O2',
							chance:1},
							{reactant:'O2',
							product:'O3',
							chance:1e-6}
						]
					}
				},
				'O2':{ 
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['O2'].unlocked;
					},
					order:701,
					html:'O<sub>2</sub>',
					type:'molecule',
				},
				'O3':{ 
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['O3'].unlocked;
					},
					order:702,
					html:'O<sub>3</sub>',
					type:'molecule',
					decay:{
						half_life:86400,
						decay_product:{'O2':1,'O':1}
					}
				},
				'17O':{ 					
					visible:function(){
						return $scope.current_element === "O" &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['17O'].unlocked;
					},
					order:710,
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
					order:720,						
					ratio:0.00201 ,
					html:'<sup>18</sup>O',
					type:'isotope'
				},
				'H2O':{ 						
					visible:function(){
						return ($scope.current_element === "H" ||
								$scope.current_element === "O") &&
								$scope.current_tab == "Elements" && 
								$scope.player.resources['H2O'].unlocked;
					},
					html:'H<sub>2</sub>O',
					type:'molecule'
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
	
	$scope.free_radicals = ['O'];
	
	$scope.unstables = ['O3'];
	
	$scope.tabs = {
			'Elements':{
					visible:function(){
						return true;
					},
					has_new:function(){
						for(var key in $scope.elements){
							if($scope.player.elements[key] != undefined &&
							$scope.player.elements[key].unlocked == true &&
							$scope.elements[key].has_new()){
								return true;
							}
						}
						var other = ['e-','n','p','energy'];
						for(var key in other){
							if($scope.player.resources[other[key]].unlocked &&
							$scope.player.resources[other[key]].is_new){
								return true;
							}
						}
						return false;
					},
					order:0
			},
			'Encyclopedia':{
					visible:function(){
						return $scope.player.intro.content;
					},
					has_new:function(){						
						for(var key in $scope.player.encyclopedia){
							if($scope.encyclopedia[key].visible() &&
							$scope.player.encyclopedia[key].is_new){
								return true;
							}
						}
					
						return false;
					},
					order:1
			},
			'Periodic Table':{
					visible:function(){
						return $scope.player.unlocks.periodic_table;
					},
					has_new:function(){
						return false;
					},
					order:2
			},
			'Options':{
					visible:function(){
						return $scope.player.intro.content;
					},
					has_new:function(){
						return false;
					},
					order:3
			}
		};
		
	$scope.encyclopedia = {
					'Hydrogen':{
						visible:function(){
							return true;
						},
						order:1,
						link:'https://en.wikipedia.org/wiki/Hydrogen',
						description:'<b>Hydrogen</b> is a chemical element with chemical symbol <b>H</b> and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass. Non-remnant stars are mainly composed of hydrogen in its plasma state. The most common isotope of hydrogen, termed protium, has one proton and no neutrons.'
						},
					'Oxygen':{
						visible:function(){
							return $scope.player.unlocks.oxygen;
						},
						order:2,
						link:'https://en.wikipedia.org/wiki/Oxygen',
						description:'<b>Oxygen</b> is a chemical element with symbol <b>O</b> and atomic number 8. It is a member of the chalcogen group on the periodic table and is a highly reactive nonmetal and oxidizing agent that readily forms compounds (notably oxides) with most elements. By mass, oxygen is the third-most abundant element in the universe, after hydrogen and helium. At standard temperature and pressure, two atoms of the element bind to form dioxygen, a colorless and odorless diatomic gas with the formula O<sub>2</sub>. Diatomic oxygen gas constitutes 20.8% of the Earth\'s atmosphere. Oxygen is the most abundant element by mass in the Earth\'s crust as part of oxide compounds such as silicon dioxide, making up almost half of the crust\'s mass.'
						},
					'Isotope':{
						visible:function(){
							return $scope.player.unlocks.isotope;
						},
						order:3,
						link:'https://en.wikipedia.org/wiki/Isotope',
						description:'<b>Isotopes</b> are variants of a particular chemical element which differ in neutron number, although all isotopes of a given element have the same number of protons in each atom. The term isotope is formed from the Greek roots isos (ἴσος "equal") and topos (τόπος "place"), meaning "the same place"; thus, the meaning behind the name it is that different isotopes of a single element occupy the same position on the periodic table. The number of protons within the atom\'s nucleus is called atomic number and is equal to the number of electrons in the neutral (non-ionized) atom. Each atomic number identifies a specific element, but not the isotope; an atom of a given element may have a wide range in its number of neutrons. The number of nucleons (both protons and neutrons) in the nucleus is the atom\'s mass number, and each isotope of a given element has a different mass number.'
						},
					'Electron':{
						visible:function(){
							return $scope.player.unlocks.electron;
						},
						order:4,
						link:'https://en.wikipedia.org/wiki/Electron',
						description:'The <b>electron</b> is a subatomic particle, symbol e−, with a negative elementary electric charge. Electrons belong to the first generation of the lepton particle family, and are generally thought to be elementary particles because they have no known components or substructure. The electron has a mass that is approximately 1/1836 that of the proton. Quantum mechanical properties of the electron include an intrinsic angular momentum (spin) of a half-integer value in units of ħ, which means that it is a fermion. Being fermions, no two electrons can occupy the same quantum state, in accordance with the Pauli exclusion principle.'
						},
					'Proton':{
						visible:function(){
							return $scope.player.unlocks.proton;
						},
						order:5,
						link:'https://en.wikipedia.org/wiki/Proton',
						description:'The <b>proton</b> is a subatomic particle, symbol p, with a positive electric charge of +1e elementary charge and mass slightly less than that of a neutron. Protons and neutrons, each with mass approximately one atomic mass unit, are collectively referred to as "nucleons". One or more protons are present in the nucleus of every atom. The number of protons in the nucleus is the defining property of an element, and is referred to as the atomic number. Since each element has a unique number of protons, each element has its own unique atomic number.'
						},
					'Neutron':{
						visible:function(){
							return $scope.player.unlocks.neutron;
						},
						order:6,
						link:'https://en.wikipedia.org/wiki/Neutron',
						description:'The <b>neutron</b> is a subatomic particle, symbol n, with no net electric charge and a mass slightly larger than that of a proton. Protons and neutrons, each with mass approximately one atomic mass unit, constitute the nucleus of an atom, and they are collectively referred to as nucleons. Their properties and interactions are described by nuclear physics.<br>Within the nucleus, protons and neutrons are bound together through the nuclear force, and neutrons are required for the stability of nuclei. Neutrons are produced copiously in nuclear fission and fusion. They are a primary contributor to the nucleosynthesis of chemical elements within stars through fission, fusion, and neutron capture processes.'
						},
					'Radioactivity':{
						visible:function(){
							return $scope.player.unlocks.radioactivity;
						},
						order:8,
						link:'https://en.wikipedia.org/wiki/Radioactive_decay',
						description:'<b>Radioactive decay</b>, also known as <b>nuclear decay</b> or <b>radioactivity</b>, is the process by which a nucleus of an unstable atom loses energy by emitting <b>radiation</b>. A material that spontaneously emits such radiation — which includes alpha particles, beta particles, gamma rays and conversion electrons — is considered radioactive.<br>Radioactive decay is a stochastic (i.e. random) process at the level of single atoms, in that, according to quantum theory, it is impossible to predict when a particular atom will decay. The chance that a given atom will decay never changes, that is, it does not matter how long the atom has existed. For a large collection of atoms however, the decay rate for that collection can be calculated from their measured decay constants or half-lives.<BR>There are many different types of radioactive decay. A decay, or loss of energy from the nucleus, results when an atom with one type of nucleus, called the parent radionuclide (or parent radioisotope), transforms into an atom with a nucleus in a different state, or with a nucleus containing a different number of protons and neutrons. The product is called the daughter nuclide. In some decays, the parent and the daughter nuclides are different chemical elements, and thus the decay process results in the creation of an atom of a different element. This is known as a nuclear transmutation.'
						},
					'Half-life':{
						visible:function(){
							return $scope.player.unlocks.half_life;
						},
						order:9,
						link:'https://en.wikipedia.org/wiki/Half-life',
						description:'<b>Half-life</b> (t<sub>1/2</sub>) is the amount of time required for the amount of something to fall to half its initial value. The term is very commonly used in nuclear physics to describe how quickly unstable atoms undergo radioactive decay, but it is also used more generally for discussing any type of exponential decay. <br>Half-life is used to describe a quantity undergoing exponential decay, and is constant over the lifetime of the decaying quantity. It is a characteristic unit for the exponential decay equation. The term "half-life" may generically be used to refer to any period of time in which a quantity falls by half, even if the decay is not exponential.'
						},
					'Beta decay':{
						visible:function(){
							return $scope.player.unlocks.beta_decay;
						},
						order:10,
						link:'https://en.wikipedia.org/wiki/Beta_decay',
						description:'In nuclear physics, <b>beta decay</b> (β-decay) is a type of radioactive decay in which a proton is transformed into a neutron, or vice versa, inside an atomic nucleus. This process allows the atom to move closer to the optimal ratio of protons and neutrons. As a result of this transformation, the nucleus emits a detectable beta particle, which is an electron or positron.<br>Beta decay is mediated by the weak force. There are two types of beta decay, known as beta minus and beta plus. In beta minus (β−) decay a neutron is lost and a proton appears and the process produces an electron and electron antineutrino, while in beta plus (β+) decay a proton is lost and a neutron appears and the process produces a positron and electron neutrino; β+ decay is thus also known as positron emission.'
						},
					'Energy':{
						visible:function(){
							return $scope.player.unlocks.energy;
						},
						order:11,
						link:'https://en.wikipedia.org/wiki/Energy',
						description:'In physics, <b>energy</b> is a property of objects which can be transferred to other objects or converted into different forms, but cannot be created or destroyed. The "ability of a system to perform work" is a common description, but it is difficult to give one single comprehensive definition of energy because of its many forms. <br>Common energy forms include the kinetic energy of a moving object, the potential energy stored by an object\'s position in a force field (gravitational, electric or magnetic), the elastic energy stored by stretching solid objects, the chemical energy released when a fuel burns, the radiant energy carried by light, and the thermal energy due to an object\'s temperature. All of the many forms of energy are convertible to other kinds of energy, and obey the law of conservation of energy which says that energy can be neither created nor be destroyed; however, it can change from one form to another.'
						},
					'Electronvolt':{
						visible:function(){
							return $scope.player.unlocks.energy;
						},
						order:12,
						link:'https://en.wikipedia.org/wiki/Electronvolt',
						description:'In physics, the <b>electronvolt</b> (symbol <b>eV</b>; also written <b>electron volt</b>) is a unit of energy equal to approximately 160 zeptojoules (symbol zJ) or 1.6 × 10<sup>−19</sup> joules (symbol J). By definition, it is the amount of energy gained (or lost) by the charge of a single electron moving across an electric potential difference of one volt. <br>The electron volt is not an SI unit, and its definition is empirical, thus its value in SI units must be obtained experimentally.'
						},
					'Ionization energy':{
						visible:function(){
							return $scope.player.unlocks.ionization_energy;
						},
						order:13,
						link:'https://en.wikipedia.org/wiki/Ionization_energy',
						description:'The <b>ionization energy</b> is qualitatively defined as the amount of energy required to remove the most loosely bound electron of an isolated gaseous atom to form a cation.'
						},
					'Electron affinity':{
						visible:function(){
							return $scope.player.unlocks.electron_affinity;
						},
						order:14,
						link:'https://en.wikipedia.org/wiki/Electron_affinity',
						description:'In chemistry and atomic physics, the <b>electron affinity</b> of an atom or molecule is defined as the amount of energy released when an electron is added to a neutral atom or molecule in the gaseous state to form a negative ion.'
						},
					'Nuclear binding energy':{
						visible:function(){
							return $scope.player.unlocks.nuclear_binding_energy;
						},
						order:15,
						link:'https://en.wikipedia.org/wiki/Nuclear_binding_energy',
						description:'<b>Nuclear binding energy</b> is the energy that would be required to disassemble the nucleus of an atom into its component parts. These component parts are neutrons and protons, which are collectively called nucleons. The binding energy of nuclei is due to the attractive forces that hold these nucleons together and this is usually a positive number, since most nuclei would require the expenditure of energy to separate them into individual protons and neutrons. The mass of an atomic nucleus is usually less than the sum of the individual masses of the constituent protons and neutrons (according to Einstein\'s equation E=mc<sup>2</sup>) and this \'missing mass\' is known as the mass defect, and represents the energy that was released when the nucleus was formed.'
						},
					'Synthesis':{
						visible:function(){
							return $scope.player.unlocks.synthesis;
						},
						order:16,
						link:'https://en.wikipedia.org/wiki/Chemical_synthesis',
						description:'<b>Chemical synthesis</b> is a purposeful execution of chemical reactions to obtain a product, or several products. This happens by physical and chemical manipulations usually involving one or more reactions.<br>A chemical synthesis begins by selection of compounds that are known as reagents or reactants. Various reaction types can be applied to these to synthesize the product.'
						},
					'Ion':{
						visible:function(){
							return $scope.player.unlocks.ion;
						},
						order:17,
						link:'https://en.wikipedia.org/wiki/Ion',
						description:'An <b>ion</b> (/ˈaɪən, -ɒn/) is an atom or a molecule in which the total number of electrons is not equal to the total number of protons, giving the atom or molecule a net positive or negative electrical charge. Ions can be created, by either chemical or physical means, via ionization.<br>In chemical terms, if a neutral atom loses one or more electrons, it has a net positive charge and is known as a cation.<br>If an atom gains electrons, it has a net negative charge and is known as an anion.'
						},
					'Molecule':{
						visible:function(){
							return $scope.player.unlocks.molecule;
						},
						order:18,
						link:'https://en.wikipedia.org/wiki/Molecule',
						description:'A <b>molecule</b> (/ˈmɒlɪkjuːl/ from Latin moles "mass") is an electrically neutral group of two or more atoms held together by chemical bonds. Molecules are distinguished from ions by their lack of electrical charge.<br>A molecule may be homonuclear, that is, it consists of atoms of a single chemical element, or it may be heteronuclear, a chemical compound composed of more than one element. Atoms and complexes connected by non-covalent bonds such as hydrogen bonds or ionic bonds are generally not considered single molecules.'
						},
					'Free radical':{
						visible:function(){
							return $scope.player.unlocks.free_radical;
						},
						order:19,
						link:'https://en.wikipedia.org/wiki/Radical_%28chemistry%29',
						description:'In chemistry, a <b>radical</b> (more precisely, a <b>free radical</b>) is an atom, molecule, or ion that has unpaired valence electrons. With some exceptions, these unpaired electrons make free radicals highly chemically reactive towards other substances, or even towards themselves: their molecules will often spontaneously dimerize or polymerize if they come in contact with each other. Most radicals are reasonably stable only at very low concentrations in inert media or in a vacuum.'
						},
					'Allotrope':{
						visible:function(){
							return $scope.player.unlocks.allotrope;
						},
						order:20,
						link:'https://en.wikipedia.org/wiki/Allotropy',
						description:'<b>Allotropy</b> or <b>allotropism</b> (from Greek ἄλλος (allos), meaning "other", and τρόπος (tropos), meaning "manner, form") is the property of some chemical elements to exist in two or more different forms, in the same physical state, known as allotropes of these elements. Allotropes are different structural modifications of an element; the atoms of the element are bonded together in a different manner. '
						},
					'Unstable compound':{
						visible:function(){
							return $scope.player.unlocks.unstable_compound;
						},
						order:21,
						link:null,
						description:'A compound is a group of two or more elements<br>Unstable means it is highly reactive, and can condense, decompose, polymerize, or become self-reactive quite easily due to pressure or temperature'
						},
					'Water (H2O)':{
						visible:function(){
							return $scope.player.unlocks.finished;
						},
						order:22,
						link:'https://en.wikipedia.org/wiki/Properties_of_water',
						description:'<b>Water</b> (H<sub>2</sub>O) is the most abundant compound on Earth\'s surface, covering 70 percent of the planet. In nature, water exists in liquid, solid, and gaseous states. It is in dynamic equilibrium between the liquid and gas states at standard temperature and pressure. At room temperature, it is a tasteless and odorless liquid, nearly colorless with a hint of blue. Many substances dissolve in water and it is commonly referred to as the universal solvent. Because of this, water in nature and in use is rarely pure and some properties may vary from those of the pure substance. However, there are also many compounds that are essentially, if not completely, insoluble in water. Water is the only common substance found naturally in all three common states of matter and it is essential for all life on Earth. Water makes up 55% to 78% of the human body.'
						},
					'A word from the developer':{
						visible:function(){
							return $scope.player.unlocks.finished;
						},
						order:23,
						link:null,
						description:'Congratulations on finishing The Incremental Table of the Elements prototype!\
						<br>When you first started playing, did you think this was a simple Cookie Clicker clone? Where your surprised when you saw the first game mechanics unfold? Where you curious about what else the game had to offer? And finally, where you engage by the prospect of managing a large quantity of resources in a complex \'economy simulation\' dictated by a small set of rules? Then this prototype has served its purpose.\
						<br>The concept for this game started as a discussion about alternatives to current prestige systems. The original idea was a system where each reset introduces a new currency instead of providing a production bonus. This concept introduces several game design challenges such as how different currencies are related in a complex economic simulation. A parallel was drawn between this concept and the way different elements atoms interact, and the focus of the idea shifted to a chemistry-based game.\
						<br>The first objective of this game is to provide a truly incremental (unfolding) experience where game mechanics are unveiled progressively, and the way the game operates is changed by means of paradign shifts.\
						<br>The second objective is offering a massive economy simulation experience, in a system with (potentially) thousands of different interconnected resources. However this depth is offered elegantly, via a small and consistent set of rules.\
						<br>For this prototype we implemented what we consider the fundamental set of rules of the game (isotopes, radioactivity, reactions, etc.) and two elements, just to showcase the potential of the whole system. However, the realization of the whole game doesn\'t come without challenges; implementation challenges, design challenges, and most importantly, game design challenges.\
						<ul>\
							<li> Performance is an issue. It is not clear of Javascript can handle a system with thousands of resources and complex calculations. The current prototype has been implemented in the fastest way possible and heavy refactoring would be needed to support a final product.\
							<il>Display of resources. How can we show to the player the relevant information in a game with thousands of resources? What options should the player have to filter and order the information? How to do this in an efficient (computationally speaking) way?\
							<li>Limits. There is a (practical) finite amount of elements, isotopes and ions. However, by definition, there is an unlimited amount of molecules that we can create. Therefore we should define an arbitrary limit on what molecules are to be included (e.g. by number of components).\
							<li>Theme. Incremental games like A Dark Room and Kittens Game have a strong theme and a weak plot to drive the player. This game has a strong theme but no plot at all. Is the theme enough to drive the players? Is it interesting at all?\
							<li>Balance. So far all numbers except for generators have been lifted from nature. This means that, although by laws of nature, no values will be game breaking, neither will they be finely tuned to make for the best user experience. To put it bold, nature cares about making things work, not about making things fun. This also implies that potentially a large number of resources will be completely useless from a game design point of view, while other will be overpowered. Also some artifacts from the laws of nature introduce huge problems from the game design perspective, that need to be addressed explicitly, yet from within the framework of the system e.g. how free radicals take away control from players and deplete the reserves of an specific, and maybe useful resource.\
							<li> A second point on balance is the feasibility of balance on the first place. Even if we decide to throw away the accuracy of the game to ignore the values of nature, balancing a system with thousands of interlocked resources is a daunting task indeed.\
							<li>Lastly, a crucial point remains unanswered: is the game engaging? Even if we manage to solve all the previous challenges, all the effort will go to waste of nobody wants to play the game. On its current state, the game has no purpose other than exploring the spaces of posibilities. The game has no challenge nor goal, and is closer to a toy than a game. Other games actually suffer from a similar problem and solve it by offering the player rewards or setting arbitrary goals. Would this system work for this game? For instance, offering the player a large array of achievements consisting of unlocking a certain part of the game, and then let him explore the massive space of possibilities of the game to find his way to this goal.\
						</ul>\
						Finally, the current system could be expanded by lifting even more game mechanics from the laws of nature. The following are some ideas that could extend the system and exponentially increase the complexity of gameplay while maintaining an elegant design.\
						<ul>\
							<li>More resource attributes. Currently resources are described by a set of very basic properties. However all elements have far more physical and chemical attributes that can be included in the model.\
							<li>Control of temperature and pressure. Temperature and pressure change the behaviour of elements. By offering control of temperature and pressure of the system, players would have an exponentially higher possibility space to explore, and some actions would be harder or easier to perform in different scenarios.\
							<li>Antimatter. Antimatter behaves exactly like matter but with opposite electrical charges. From a game design point of view, the player would start all over again unlocking each resource on its anti-form. However the only interesting property of antimatter is that, in contact with its counterpart, it is destroyed by releasing massive amounts of energy. The gameplay interest of this system remains unclear.\
							<li>Subatomic resources. We could take a step down from elements and introduce subatomic particles in the system. These particles behave according to a different set of rules. In practice this could be implemented as a different phase in the game.\
							<li>Molecular behavior. Although molecules are present in the game, no behavior particular to molecules has been implemented as a game system. Just like for subatomic resources, a whole set of game mechanics involving only molecules could be introduces in the system. This would introduce another phase of the game.\
						</ul>\
						This concludes the developer thoughs about the game. An eventual version 1.0 would include all elements, isotopes, ions and reactions; however for the time being there is no ETA for the release. Thanks for playing.'
						}
	};


	$scope.reactions = {
		'H':{
			'ionization':{
				1:{
					reactant:{
						'energy':13.5984,
						'H':1
					},
					product:{
						'p':1,
						'e-':1
					},
					visible:function(){
						return $scope.player.unlocks["ionization_energy"] == true;
					}
				}
			},
			'electron_affinity':{
				1:{
					reactant:{
						'e-':1,
						'H':1
					},
					product:{
						'H-':1,
						'energy':0.7545
					},
					visible:function(){
						return $scope.player.unlocks["electron_affinity"] == true;
					}
				}
			},
			'binding_energy':{
				1:{
					reactant:{
						'energy':2224520,
						'2H':1
					},
					product:{
						'p':1,
						'n':1,
						'e-':1
					},
					visible:function(){
						return $scope.player.unlocks["nuclear_binding_energy"] == true &&
							$scope.player.resources['2H'].unlocked;
					}
				},
				2:{
					reactant:{
						'energy':2827266,
						'3H':1
					},
					product:{
						'p':1,
						'n':2,
						'e-':1
					},
					visible:function(){
						return $scope.player.unlocks["nuclear_binding_energy"] == true &&
							$scope.player.resources['3H'].unlocked;
					}
				}
			},
			// We could create a function that checks for every synthesis if 
			// one of the reactants is an isotope, ion or molecule of the element
			// However for the sake of a proof of concept that is beyond our scope
			'synthesis':[
				'H-p','H2O'
			]
		},
		'O':{
			'ionization':{},
			'electron_affinity':{},
			'binding_energy':{
				1:{
					reactant:{
						'energy':128030000,
						'O':1
					},
					product:{
						'p':8,
						'n':8,
						'e-':8
					},
					visible:function(){
						return $scope.player.unlocks["nuclear_binding_energy"] == true &&
							$scope.player.resources['O'].unlocked;
					}
				},
				2:{
					reactant:{
						'energy':131750000,
						'17O':1
					},
					product:{
						'p':8,
						'n':9,
						'e-':8
					},
					visible:function(){
						return $scope.player.unlocks["nuclear_binding_energy"] == true &&
							$scope.player.resources['17O'].unlocked;
					}
				},
				3:{
					reactant:{
						'energy':141170000,
						'18O':1
					},
					product:{
						'p':8,
						'n':10,
						'e-':8
					},
					visible:function(){
						return $scope.player.unlocks["nuclear_binding_energy"] == true &&
							$scope.player.resources['18O'].unlocked;
					}
				}
			},
			'synthesis':[
				'O3','H2O'
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
			},
			visible:function(){
				return $scope.player.unlocks["synthesis"] == true && 
						$scope.player.resources['H-'].unlocked &&
						$scope.player.resources['p'].unlocked &&
						$scope.current_element == "H";
			}
		},
		'O3':{
			reactant:{
				'O3':1,
				'energy':4.43
			},
			product:{
				'O2':1,
				'O':1
			},
			visible:function(){
				return $scope.player.unlocks["synthesis"] == true && 
						$scope.player.resources['O3'].unlocked &&
						$scope.player.resources['energy'].unlocked &&
						$scope.current_element == "O";
			}
		},
		'O2-OO':{
			reactant:{
				'O2':1,
				'energy':21.4219
			},
			product:{
				'O':2
			},
			visible:function(){
				return $scope.player.unlocks["synthesis"] == true && 
						$scope.player.resources['O2'].unlocked &&
						$scope.player.resources['energy'].unlocked &&
						$scope.current_element == "O";
			}
		},
		'O2O2-O3O':{
			reactant:{
				'O2':2,
				'energy':18
			},
			product:{
				'O3':1,
				'O':1
			},
			visible:function(){
				return $scope.player.unlocks["synthesis"] == true && 
						$scope.player.resources['O2'].unlocked &&
						$scope.player.resources['O3'].unlocked &&
						$scope.player.resources['energy'].unlocked &&
						$scope.current_element == "O";
			}
		},
		'H2O':{
			reactant:{
				'H2':2,
				'O2':1
			},
			product:{
				'H2O':2,
				'energy':5.925
			},
			visible:function(){
				return $scope.player.unlocks["synthesis"] == true && 
						$scope.player.resources['O'].number > 1e8 &&
						$scope.player.resources['H'].number > 1e14 &&
						($scope.current_element == "H" ||
						$scope.current_element == "O");
			}
		}
	};	
	
	$scope.html = {
		'beta-':'&#946;<sup>-</sup>'
	};
	
	$scope.unlocks = {
		"hydrogen":{
			check:function(event,data){  
				//$scope.addToast("Periodic table");
				$scope.player.unlocks["hydrogen"] = true;
				$scope.unlocks["hydrogen"].listener();
			},
			event:"cycle"
		},
		"periodic_table":{
			check:function(event,data){  
				if($scope.player.resources['e-'].unlocked &&
					$scope.player.resources['p'].unlocked &&
					$scope.player.resources['n'].unlocked){
					$scope.addToast("Periodic table");
					$scope.player.unlocks["periodic_table"] = true;
					$scope.unlocks["periodic_table"].listener();
				}
			},
			event:"cycle"
		},
		"isotope":{
			check:function(event,data){  
				if(['2H','3H'].indexOf(data) != -1){
					$scope.addToast("Isotope");
					$scope.player.unlocks["isotope"] = true;
					$scope.unlocks["isotope"].listener();
				}
			},
			event:"resource"
		},
		"ion":{
			check:function(event,data){  
				if("H-" == data){
					$scope.addToast("Ion");
					$scope.player.unlocks["ion"] = true;
					$scope.unlocks["ion"].listener();
				}
			},
			event:"resource"
		},
		"radioactivity":{
			check:function(event,data){  
				if("3H" == data){
					$scope.addToast("Radioactivity");
					$scope.player.unlocks["radioactivity"] = true;
					$scope.unlocks["radioactivity"].listener();
				}
			},
			event:"resource"
		},
		"allotrope":{
			check:function(event,data){  
				if(['O2','O3'].indexOf(data) != -1){
					$scope.addToast("Allotrope");
					$scope.player.unlocks["allotrope"] = true;
					$scope.unlocks["allotrope"].listener();
				}
			},
			event:"resource"
		},
		"free_radical":{
			check:function(event,data){  
				if("O" == data){
					$scope.addToast("Free radical");
					$scope.player.unlocks["free_radical"] = true;
					$scope.unlocks["free_radical"].listener();
				}
			},
			event:"resource"
		},
		"unstable_compound":{
			check:function(event,data){  
				if("O3" == data){
					$scope.addToast("Unstable compound");
					$scope.player.unlocks["unstable_compound"] = true;
					$scope.unlocks["unstable_compound"].listener();
				}
			},
			event:"resource"
		},
		"reactions":{
			check:function(event,data){  
				if("e-" == data){
					$scope.addToast("Reactions");
					$scope.player.unlocks["reactions"] = true;
					$scope.unlocks["reactions"].listener();
				}
			},
			event:"resource"
		},
		"electron":{
			check:function(event,data){  
				if("e-" == data){
					$scope.addToast("Electron");
					$scope.player.unlocks["electron"] = true;
					$scope.unlocks["electron"].listener();
				}
			},
			event:"resource"
		},
		"proton":{
			check:function(event,data){
				if("p" == data){
					$scope.addToast("Proton");
					$scope.player.unlocks["proton"] = true;
					$scope.unlocks["proton"].listener();
				}
			},
			event:"resource"
		},
		"neutron":{
			check:function(event,data){  
				if("n" == data){
					$scope.addToast("Neutron");
					$scope.player.unlocks["neutron"] = true;
					$scope.unlocks["neutron"].listener();
				}
			},
			event:"resource"
		},
		"energy":{
			check:function(event,data){  
				if("energy" == data){
					$scope.addToast("Energy");
					$scope.player.unlocks["energy"] = true;
					$scope.unlocks["energy"].listener();
				}
			},
			event:"resource"
		},
		"half_life":{
			check:function(event,data){  
				if("3H" == data){
					$scope.addToast("Half-life");
					$scope.player.unlocks["half_life"] = true;
					$scope.unlocks["half_life"].listener();
				}
			},
			event:"resource"
		},
		"oxygen":{
			check:function(event,data){  
				if("Oxygen" == data){
					$scope.addToast("Oxygen");
					$scope.player.unlocks["oxygen"] = true;
					$scope.unlocks["oxygen"].listener();
				}
			},
			event:"element"
		},
		"upgrade":{
			check:function(event,data){  
				if("Tier 3" == data){
					$scope.addToast("Upgrades");
					$scope.player.unlocks["upgrade"] = true;
					$scope.unlocks["upgrade"].listener();
				}
			},
			event:"upgrade"
		},
		"ionization_energy":{
			check:function(event,data){  
				if("e-" == data){
					$scope.addToast("Ionization energy");
					$scope.player.unlocks["ionization_energy"] = true;
					$scope.unlocks["ionization_energy"].listener();
				}
			},
			event:"resource"
		},
		"electron_affinity":{
			check:function(event,data){  
				if($scope.player.resources['e-'].number >= 10 &&
					$scope.player.resources['p'].number >= 10){
					$scope.addToast("Electron affinity");
					$scope.player.unlocks["electron_affinity"] = true;
					$scope.unlocks["electron_affinity"].listener();
				}
			},
			event:"cycle"
		},
		"nuclear_binding_energy":{
			check:function(event,data){  
				if($scope.player.resources['e-'].number >= 100 &&
					$scope.player.resources['p'].number >= 100){
					$scope.addToast("Nuclear binding energy");
					$scope.player.unlocks["nuclear_binding_energy"] = true;
					$scope.unlocks["nuclear_binding_energy"].listener();
				}
			},
			event:"cycle"
		},
		"beta_decay":{
			check:function(event,data){  
				if("beta-" == data){
					$scope.addToast("Beta decay");
					$scope.player.unlocks["beta_decay"] = true;
					$scope.unlocks["beta_decay"].listener();
				}
			},
			event:"decay"
		},
		"molecule":{
			check:function(event,data){  
				if("H2" == data ||
					"O2" == data ||
					"O3" == data){
					$scope.addToast("Molecule");
					$scope.player.unlocks["molecule"] = true;
					$scope.unlocks["molecule"].listener();
				}
			},
			event:"resource"
		},
		"synthesis":{
			check:function(event,data){  
				if($scope.player.resources['H-'].number >= 10){
					$scope.addToast("Synthesis");
					$scope.player.unlocks["synthesis"] = true;
					$scope.unlocks["synthesis"].listener();
				}
			},
			event:"cycle"
		},
		"finished":{
			check:function(event,data){  
				if($scope.player.resources['H2O'].unlocked){
					$scope.addToast("Congratulations! You finished the game");
					$scope.player.unlocks["finished"] = true;
					$scope.unlocks["finished"].listener();
				}
			},
			event:"cycle"
		}
	};
	
	$scope.periodic_table =[ 
	['H','','','','','','','','','','','','','','','','','He'],
	['Li','Be','','','','','','','','','','','B','C','N','O','F','Ne'],
	['Na','Mg','','','','','','','','','','','Al','Si','P','S','Cl','Ar'],
	['K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr'],
	['Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe'],
	['Cs','Ba','*','Hf','Ta','W','Re','Os','I','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn'],
	['Fr','Ra','**','Rf','Db','Sg','Bh','Hs','Mt','Ds','Rg','Cn','Uut','Fl','Uup','Lv','Uus','Uuo'],
	['','','*','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu'],
	['','','**','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr']
	];
}
