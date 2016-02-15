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
						reactivity:0.8,
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
						description:'Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group on the periodic table and is a highly reactive nonmetal and oxidizing agent that readily forms compounds (notably oxides) with most elements. By mass, oxygen is the third-most abundant element in the universe, after hydrogen and helium. At standard temperature and pressure, two atoms of the element bind to form dioxygen, a colorless and odorless diatomic gas with the formula O<sub>2</sub>. Diatomic oxygen gas constitutes 20.8% of the Earth\'s atmosphere. Oxygen is the most abundant element by mass in the Earth\'s crust as part of oxide compounds such as silicon dioxide, making up almost half of the crust\'s mass.'
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
						description:'The electron is a subatomic particle, symbol e−, with a negative elementary electric charge. Electrons belong to the first generation of the lepton particle family, and are generally thought to be elementary particles because they have no known components or substructure. The electron has a mass that is approximately 1/1836 that of the proton. Quantum mechanical properties of the electron include an intrinsic angular momentum (spin) of a half-integer value in units of ħ, which means that it is a fermion. Being fermions, no two electrons can occupy the same quantum state, in accordance with the Pauli exclusion principle.'
						},
					'Proton':{
						visible:function(){
							return $scope.player.unlocks.proton;
						},
						order:5,
						link:'https://en.wikipedia.org/wiki/Proton',
						description:'The proton is a subatomic particle, symbol p, with a positive electric charge of +1e elementary charge and mass slightly less than that of a neutron. Protons and neutrons, each with mass approximately one atomic mass unit, are collectively referred to as "nucleons". One or more protons are present in the nucleus of every atom. The number of protons in the nucleus is the defining property of an element, and is referred to as the atomic number. Since each element has a unique number of protons, each element has its own unique atomic number.'
						},
					'Neutron':{
						visible:function(){
							return $scope.player.unlocks.neutron;
						},
						order:6,
						link:'https://en.wikipedia.org/wiki/Neutron',
						description:'The neutron is a subatomic particle, symbol n, with no net electric charge and a mass slightly larger than that of a proton. Protons and neutrons, each with mass approximately one atomic mass unit, constitute the nucleus of an atom, and they are collectively referred to as nucleons. Their properties and interactions are described by nuclear physics.<br>Within the nucleus, protons and neutrons are bound together through the nuclear force, and neutrons are required for the stability of nuclei. Neutrons are produced copiously in nuclear fission and fusion. They are a primary contributor to the nucleosynthesis of chemical elements within stars through fission, fusion, and neutron capture processes.'
						},
					'Radioactivity':{
						visible:function(){
							return $scope.player.unlocks.radioactivity;
						},
						order:8,
						link:'https://en.wikipedia.org/wiki/Radioactive_decay',
						description:'Radioactive decay, also known as nuclear decay or radioactivity, is the process by which a nucleus of an unstable atom loses energy by emitting radiation. A material that spontaneously emits such radiation — which includes alpha particles, beta particles, gamma rays and conversion electrons — is considered radioactive.<br>Radioactive decay is a stochastic (i.e. random) process at the level of single atoms, in that, according to quantum theory, it is impossible to predict when a particular atom will decay. The chance that a given atom will decay never changes, that is, it does not matter how long the atom has existed. For a large collection of atoms however, the decay rate for that collection can be calculated from their measured decay constants or half-lives.<BR>There are many different types of radioactive decay. A decay, or loss of energy from the nucleus, results when an atom with one type of nucleus, called the parent radionuclide (or parent radioisotope), transforms into an atom with a nucleus in a different state, or with a nucleus containing a different number of protons and neutrons. The product is called the daughter nuclide. In some decays, the parent and the daughter nuclides are different chemical elements, and thus the decay process results in the creation of an atom of a different element. This is known as a nuclear transmutation.'
						},
					'Half-life':{
						visible:function(){
							return $scope.player.unlocks.half_life;
						},
						order:9,
						link:'https://en.wikipedia.org/wiki/Half-life',
						description:'Half-life (t1⁄2) is the amount of time required for the amount of something to fall to half its initial value. The term is very commonly used in nuclear physics to describe how quickly unstable atoms undergo radioactive decay, but it is also used more generally for discussing any type of exponential decay. <br>Half-life is used to describe a quantity undergoing exponential decay, and is constant over the lifetime of the decaying quantity. It is a characteristic unit for the exponential decay equation. The term "half-life" may generically be used to refer to any period of time in which a quantity falls by half, even if the decay is not exponential.'
						},
					'Beta decay':{
						visible:function(){
							return $scope.player.unlocks.beta_decay;
						},
						order:10,
						link:'https://en.wikipedia.org/wiki/Beta_decay',
						description:'In nuclear physics, beta decay (β-decay) is a type of radioactive decay in which a proton is transformed into a neutron, or vice versa, inside an atomic nucleus. This process allows the atom to move closer to the optimal ratio of protons and neutrons. As a result of this transformation, the nucleus emits a detectable beta particle, which is an electron or positron.<br>Beta decay is mediated by the weak force. There are two types of beta decay, known as beta minus and beta plus. In beta minus (β−) decay a neutron is lost and a proton appears and the process produces an electron and electron antineutrino, while in beta plus (β+) decay a proton is lost and a neutron appears and the process produces a positron and electron neutrino; β+ decay is thus also known as positron emission.'
						},
					'Energy':{
						visible:function(){
							return $scope.player.unlocks.energy;
						},
						order:11,
						link:'https://en.wikipedia.org/wiki/Energy',
						description:'In physics, energy is a property of objects which can be transferred to other objects or converted into different forms, but cannot be created or destroyed. The "ability of a system to perform work" is a common description, but it is difficult to give one single comprehensive definition of energy because of its many forms. <br>Common energy forms include the kinetic energy of a moving object, the potential energy stored by an object\'s position in a force field (gravitational, electric or magnetic), the elastic energy stored by stretching solid objects, the chemical energy released when a fuel burns, the radiant energy carried by light, and the thermal energy due to an object\'s temperature. All of the many forms of energy are convertible to other kinds of energy, and obey the law of conservation of energy which says that energy can be neither created nor be destroyed; however, it can change from one form to another.'
						},
					'Electronvolt':{
						visible:function(){
							return $scope.player.unlocks.energy;
						},
						order:12,
						link:'https://en.wikipedia.org/wiki/Electronvolt',
						description:'In physics, the electronvolt (symbol eV; also written electron volt) is a unit of energy equal to approximately 160 zeptojoules (symbol zJ) or 1.6 × 10<sup>−19</sup> joules (symbol J). By definition, it is the amount of energy gained (or lost) by the charge of a single electron moving across an electric potential difference of one volt. <br>The electron volt is not an SI unit, and its definition is empirical, thus its value in SI units must be obtained experimentally.'
						},
					'Ionization energy':{
						visible:function(){
							return $scope.player.unlocks.ionization_energy;
						},
						order:13,
						link:'https://en.wikipedia.org/wiki/Ionization_energy',
						description:'The ionization energy is qualitatively defined as the amount of energy required to remove the most loosely bound electron of an isolated gaseous atom to form a cation.'
						},
					'Electron affinity':{
						visible:function(){
							return $scope.player.unlocks.electron_affinity;
						},
						order:14,
						link:'https://en.wikipedia.org/wiki/Electron_affinity',
						description:'In chemistry and atomic physics, the electron affinity of an atom or molecule is defined as the amount of energy released when an electron is added to a neutral atom or molecule in the gaseous state to form a negative ion.'
						},
					'Nuclear binding energy':{
						visible:function(){
							return $scope.player.unlocks.nuclear_binding_energy;
						},
						order:15,
						link:'https://en.wikipedia.org/wiki/Nuclear_binding_energy',
						description:'Nuclear binding energy is the energy that would be required to disassemble the nucleus of an atom into its component parts. These component parts are neutrons and protons, which are collectively called nucleons. The binding energy of nuclei is due to the attractive forces that hold these nucleons together and this is usually a positive number, since most nuclei would require the expenditure of energy to separate them into individual protons and neutrons. The mass of an atomic nucleus is usually less than the sum of the individual masses of the constituent protons and neutrons (according to Einstein\'s equation E=mc<sup>2</sup>) and this \'missing mass\' is known as the mass defect, and represents the energy that was released when the nucleus was formed.'
						},
					'Synthesis':{
						visible:function(){
							return $scope.player.unlocks.synthesis;
						},
						order:16,
						link:'https://en.wikipedia.org/wiki/Chemical_synthesis',
						description:'Chemical synthesis is a purposeful execution of chemical reactions to obtain a product, or several products. This happens by physical and chemical manipulations usually involving one or more reactions.<br>A chemical synthesis begins by selection of compounds that are known as reagents or reactants. Various reaction types can be applied to these to synthesize the product.'
						},
					'Ion':{
						visible:function(){
							return $scope.player.unlocks.ion;
						},
						order:17,
						link:'https://en.wikipedia.org/wiki/Ion',
						description:'An ion (/ˈaɪən, -ɒn/) is an atom or a molecule in which the total number of electrons is not equal to the total number of protons, giving the atom or molecule a net positive or negative electrical charge. Ions can be created, by either chemical or physical means, via ionization.<br>In chemical terms, if a neutral atom loses one or more electrons, it has a net positive charge and is known as a cation.<br>If an atom gains electrons, it has a net negative charge and is known as an anion.'
						},
					'Molecule':{
						visible:function(){
							return $scope.player.unlocks.molecule;
						},
						order:18,
						link:'https://en.wikipedia.org/wiki/Molecule',
						description:'A molecule (/ˈmɒlɪkjuːl/ from Latin moles "mass") is an electrically neutral group of two or more atoms held together by chemical bonds. Molecules are distinguished from ions by their lack of electrical charge.<br>A molecule may be homonuclear, that is, it consists of atoms of a single chemical element, or it may be heteronuclear, a chemical compound composed of more than one element. Atoms and complexes connected by non-covalent bonds such as hydrogen bonds or ionic bonds are generally not considered single molecules.'
						},
					'Free radical':{
						visible:function(){
							return $scope.player.unlocks.free_radical;
						},
						order:19,
						link:'https://en.wikipedia.org/wiki/Radical_%28chemistry%29',
						description:'In chemistry, a radical (more precisely, a free radical) is an atom, molecule, or ion that has unpaired valence electrons. With some exceptions, these unpaired electrons make free radicals highly chemically reactive towards other substances, or even towards themselves: their molecules will often spontaneously dimerize or polymerize if they come in contact with each other. Most radicals are reasonably stable only at very low concentrations in inert media or in a vacuum.'
						},
					'Allotrope':{
						visible:function(){
							return $scope.player.unlocks.allotrope;
						},
						order:20,
						link:'https://en.wikipedia.org/wiki/Allotropy',
						description:'Allotropy or allotropism (from Greek ἄλλος (allos), meaning "other", and τρόπος (tropos), meaning "manner, form") is the property of some chemical elements to exist in two or more different forms, in the same physical state, known as allotropes of these elements. Allotropes are different structural modifications of an element; the atoms of the element are bonded together in a different manner. '
						},
					'Unstable compound':{
						visible:function(){
							return $scope.player.unlocks.unstable_compound;
						},
						order:21,
						link:'',
						description:'A compound is a group of two or more elements<br>Unstable means it is highly reactive, and can condense, decompose, polymerize, or become self-reactive quite easily due to pressure or temperature'
						},
					'A word from the developer':{
						visible:function(){
							return $scope.player.unlocks.finished;
						},
						order:22,
						link:'',
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
					},
					visible:function(){
						return $scope.player.resources['energy'].unlocked;
					},
					order:0
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
					},
					visible:function(){
						return $scope.player.resources['e-'].unlocked;
					},
					order:0
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
					},
					visible:function(){
						return $scope.player.resources['2H'].unlocked;
					},
					order:0
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
					},
					visible:function(){
						return $scope.player.resources['3H'].unlocked;
					},
					order:1
				}
			],
			'synthesis':[
				'H-p'
			]
		},
		'O':{
			'ionization':[

			],
			'electron_affinity':[

			],
			'binding_energy':[

			],
			'synthesis':[
				'O3'
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
				return $scope.player.resources['H-'].unlocked &&
						$scope.player.resources['p'].unlocked;
			},
			order:0
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
				return $scope.player.resources['O3'].unlocked &&
						$scope.player.resources['energy'].unlocked;
			},
			order:1
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
