function loadData($scope) {
  $scope.elements = {
    'H' : {
      name : 'Hydrogen',
      isotopes : [ '2H', '3H' ],
      visible : function () {
        return $scope.player.data.elements.H.unlocked;
      },
      has_new : function () {
        var includes = [ 'H', '2H', '3H', 'H-', 'H2' ];
        for ( var key in includes) {
          if ($scope.player.data.resources[includes[key]].unlocked && $scope.player.data.resources[includes[key]].is_new) {
            return true;
          }
        }
        for ( var key in $scope.reactions.H.synthesis) {
          if ($scope.synthesis[$scope.reactions.H.synthesis[key]].visible() &&
              $scope.player.data.synthesis[$scope.reactions.H.synthesis[key]].is_new) {
            return true;
          }
        }
        return false;
      },
      number : 1
    },
    'He' : {
      name : 'Helium',
      isotopes : [ '3He' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.He.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 2,
      disabled : true
    },
    'Li' : {
      name : 'Lithium',
      isotopes : [ '7Li' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.Li.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 3,
      disabled : true
    },
    'Be' : {
      name : 'Beryllium',
      isotopes : [ '7Be', '10Be' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.Be.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 4,
      disabled : true
    },
    'B' : {
      name : 'Boron',
      isotopes : [ '11B' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.B.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 5,
      disabled : true
    },
    'C' : {
      name : 'Carbon',
      isotopes : [ '11C', '13C', '14C' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.C.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 6,
      disabled : true
    },
    'N' : {
      name : 'Nitrogen',
      isotopes : [ '13N', '15N' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.N.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 7,
      disabled : true
    },
    'O' : {
      name : 'Oxygen',
      isotopes : [ '17O', '18O' ],
      visible : function () {
        return $scope.player.data.elements.O.unlocked;
      },
      has_new : function () {
        var includes = [ 'O', '17O', '18O', 'O2', 'O3' ];
        for ( var key in includes) {
          if ($scope.player.data.resources[includes[key]].unlocked && $scope.player.data.resources[includes[key]].is_new) {
            return true;
          }
        }
        for ( var key in $scope.reactions.O.synthesis) {
          if ($scope.synthesis[$scope.reactions.O.synthesis[key]].visible() &&
              $scope.player.data.synthesis[$scope.reactions.O.synthesis[key]].is_new) {
            return true;
          }
        }
        return false;
      },
      number : 8
    },
    'F' : {
      name : 'Fluorine',
      isotopes : [ '18F' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.F.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 9,
      disabled : true
    },
    'Ne' : {
      name : 'Neon',
      isotopes : [ '21Ne', '22Ne' ],
      visible : function () {
        return false;
        // return $scope.player.data.elements.Ne.unlocked;
      },
      has_new : function () {
        return false;
      },
      number : 10,
      disabled : true
    },
    'Na' : {
      name : 'Sodium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 11,
      disabled : true
    },
    'Mg' : {
      name : 'Magnesium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 12,
      disabled : true
    },
    'Al' : {
      name : 'Aluminium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 13,
      disabled : true
    },
    'Si' : {
      name : 'Silicon',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 14,
      disabled : true
    },
    'P' : {
      name : 'Phosphorus',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 15,
      disabled : true
    },
    'S' : {
      name : 'Sulfur',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 16,
      disabled : true
    },
    'Cl' : {
      name : 'Chlorine',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 17,
      disabled : true
    },
    'Ar' : {
      name : 'Argon',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 18,
      disabled : true
    },
    'K' : {
      name : 'Potassium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 19,
      disabled : true
    },
    'Ca' : {
      name : 'Calcium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 20,
      disabled : true
    },
    'Sc' : {
      name : 'Scandium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 21,
      disabled : true
    },
    'Ti' : {
      name : 'Titanium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 22,
      disabled : true
    },
    'V' : {
      name : 'Vanadium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 23,
      disabled : true
    },
    'Cr' : {
      name : 'Chromium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 24,
      disabled : true
    },
    'Mn' : {
      name : 'Manganese',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 25,
      disabled : true
    },
    'Fe' : {
      name : 'Iron',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 26,
      disabled : true
    },
    'Co' : {
      name : 'Cobalt',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 27,
      disabled : true
    },
    'Ni' : {
      name : 'Nickel',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 28,
      disabled : true
    },
    'Cu' : {
      name : 'Copper',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 29,
      disabled : true
    },
    'Zn' : {
      name : 'Zinc',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 30,
      disabled : true
    },
    'Ga' : {
      name : 'Gallium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 31,
      disabled : true
    },
    'Ge' : {
      name : 'Germanium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 32,
      disabled : true
    },
    'As' : {
      name : 'Arsenic',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 33,
      disabled : true
    },
    'Se' : {
      name : 'Selenium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 34,
      disabled : true
    },
    'Br' : {
      name : 'Bromine',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 35,
      disabled : true
    },
    'Kr' : {
      name : 'Krypton',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 36,
      disabled : true
    },
    'Rb' : {
      name : 'Rubidium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 37,
      disabled : true
    },
    'Sr' : {
      name : 'Strontium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 38,
      disabled : true
    },
    'Y' : {
      name : 'Yttrium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 39,
      disabled : true
    },
    'Zr' : {
      name : 'Zirconium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 40,
      disabled : true
    },
    'Nb' : {
      name : 'Niobium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 41,
      disabled : true
    },
    'Mo' : {
      name : 'Molybdenum',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 42,
      disabled : true
    },
    'Tc' : {
      name : 'Technetium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 43,
      disabled : true
    },
    'Ru' : {
      name : 'Ruthenium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 44,
      disabled : true
    },
    'Rh' : {
      name : 'Rhodium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 45,
      disabled : true
    },
    'Pd' : {
      name : 'Palladium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 46,
      disabled : true
    },
    'Ag' : {
      name : 'Silver',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 47,
      disabled : true
    },
    'Cd' : {
      name : 'Cadmium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 48,
      disabled : true
    },
    'In' : {
      name : 'Indium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 49,
      disabled : true
    },
    'Sn' : {
      name : 'Tin',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 50,
      disabled : true
    },
    'Sb' : {
      name : 'Antimony',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 51,
      disabled : true
    },
    'Te' : {
      name : 'Tellurium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 52,
      disabled : true
    },
    'I' : {
      name : 'Iodine',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 53,
      disabled : true
    },
    'Xe' : {
      name : 'Xenon',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 54,
      disabled : true
    },
    'Cs' : {
      name : 'Caesium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 55,
      disabled : true
    },
    'Ba' : {
      name : 'Barium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 56,
      disabled : true
    },
    'La' : {
      name : 'Lanthanum',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 57,
      disabled : true
    },
    'Ce' : {
      name : 'Cerium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 58,
      disabled : true
    },
    'Pr' : {
      name : 'Praseodymium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 59,
      disabled : true
    },
    'Nd' : {
      name : 'Neodymium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 60,
      disabled : true
    },
    'Pm' : {
      name : 'Promethium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 61,
      disabled : true
    },
    'Sm' : {
      name : 'Samarium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 62,
      disabled : true
    },
    'Eu' : {
      name : 'Europium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 63,
      disabled : true
    },
    'Gd' : {
      name : 'Gadolinium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 64,
      disabled : true
    },
    'Tb' : {
      name : 'Terbium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 65,
      disabled : true
    },
    'Dy' : {
      name : 'Dysprosium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 66,
      disabled : true
    },
    'Ho' : {
      name : 'Holmium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 67,
      disabled : true
    },
    'Er' : {
      name : 'Erbium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 68,
      disabled : true
    },
    'Tm' : {
      name : 'Thulium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 69,
      disabled : true
    },
    'Yb' : {
      name : 'Ytterbium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 70,
      disabled : true
    },
    'Lu' : {
      name : 'Lutetium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 71,
      disabled : true
    },
    'Hf' : {
      name : 'Hafnium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 72,
      disabled : true
    },
    'Ta' : {
      name : 'Tantalum',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 73,
      disabled : true
    },
    'W' : {
      name : 'Tungsten',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 74,
      disabled : true
    },
    'Re' : {
      name : 'Rhenium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 75,
      disabled : true
    },
    'Os' : {
      name : 'Osmium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 76,
      disabled : true
    },
    'Ir' : {
      name : 'Iridium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 77,
      disabled : true
    },
    'Pt' : {
      name : 'Platinum',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 78,
      disabled : true
    },
    'Au' : {
      name : 'Gold',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 79,
      disabled : true
    },
    'Hg' : {
      name : 'Mercury',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 80,
      disabled : true
    },
    'Tl' : {
      name : 'Thallium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 81,
      disabled : true
    },
    'Pb' : {
      name : 'Lead',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 82,
      disabled : true
    },
    'Bi' : {
      name : 'Bismuth',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 83,
      disabled : true
    },
    'Po' : {
      name : 'Polonium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 84,
      disabled : true
    },
    'At' : {
      name : 'Astatine',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 85,
      disabled : true
    },
    'Rn' : {
      name : 'Radon',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 86,
      disabled : true
    },
    'Fr' : {
      name : 'Francium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 87,
      disabled : true
    },
    'Ra' : {
      name : 'Radium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 88,
      disabled : true
    },
    'Ac' : {
      name : 'Actinium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 89,
      disabled : true
    },
    'Th' : {
      name : 'Thorium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 90,
      disabled : true
    },
    'Pa' : {
      name : 'Protactinium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 91,
      disabled : true
    },
    'U' : {
      name : 'Uranium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 92,
      disabled : true
    },
    'Np' : {
      name : 'Neptunium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 93,
      disabled : true
    },
    'Pu' : {
      name : 'Plutonium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 94,
      disabled : true
    },
    'Am' : {
      name : 'Americium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 95,
      disabled : true
    },
    'Cm' : {
      name : 'Curium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 96,
      disabled : true
    },
    'Bk' : {
      name : 'Berkelium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 97,
      disabled : true
    },
    'Cf' : {
      name : 'Californium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 98,
      disabled : true
    },
    'Es' : {
      name : 'Einsteinium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 99,
      disabled : true
    },
    'Fm' : {
      name : 'Fermium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 100,
      disabled : true
    },
    'Md' : {
      name : 'Mendelevium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 101,
      disabled : true
    },
    'No' : {
      name : 'Nobelium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 102,
      disabled : true
    },
    'Lr' : {
      name : 'Lawrencium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 103,
      disabled : true
    },
    'Rf' : {
      name : 'Rutherfordium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 104,
      disabled : true
    },
    'Db' : {
      name : 'Dubnium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 105,
      disabled : true
    },
    'Sg' : {
      name : 'Seaborgium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 106,
      disabled : true
    },
    'Bh' : {
      name : 'Bohrium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 107,
      disabled : true
    },
    'Hs' : {
      name : 'Hassium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 108,
      disabled : true
    },
    'Mt' : {
      name : 'Meitnerium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 109,
      disabled : true
    },
    'Ds' : {
      name : 'Darmstadtium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 110,
      disabled : true
    },
    'Rg' : {
      name : 'Roentgenium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 111,
      disabled : true
    },
    'Cn' : {
      name : 'Copernicium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 112,
      disabled : true
    },
    'Nh' : {
      name : 'Nihonium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 113,
      disabled : true
    },
    'Fl' : {
      name : 'Flerovium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 114,
      disabled : true
    },
    'Mc' : {
      name : 'Moscovium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 115,
      disabled : true
    },
    'Lv' : {
      name : 'Livermorium',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 116,
      disabled : true
    },
    'Ts' : {
      name : 'Tennessine',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 117,
      disabled : true
    },
    'Og' : {
      name : 'Oganesson',
      isotopes : [],
      visible : function () {
        return false;
      },
      has_new : function () {
        return false;
      },
      number : 118,
      disabled : true
    }
  };

  $scope.generators = {
    "Tier 1": {
        visible : function () {
            return true;
          },
      price: 15,
      "power": 1,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 1-1",
        "Tier 1-2",
        "Tier 1-3",
        "Tier 1-4",
        "Tier 1-5",
        "Tier 1-6",
        "Tier 1-7",
        "Tier 1-8"
      ]
    },
    "Tier 2": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 1'].level > 0;
          },
      price: 100,
      "power": 10,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 2-1",
        "Tier 2-2",
        "Tier 2-3",
        "Tier 2-4",
        "Tier 2-5",
        "Tier 2-6",
        "Tier 2-7",
        "Tier 2-8"
      ]
    },
    "Tier 3": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 2'].level > 0;
          },
      price: 1100,
      "power": 80,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 3-1",
        "Tier 3-2",
        "Tier 3-3",
        "Tier 3-4",
        "Tier 3-5",
        "Tier 3-6",
        "Tier 3-7",
        "Tier 3-8"
      ]
    },
    "Tier 4": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 3'].level > 0;
          },
      price: 12000,
      "power": 470,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 4-1",
        "Tier 4-2",
        "Tier 4-3",
        "Tier 4-4",
        "Tier 4-5",
        "Tier 4-6",
        "Tier 4-7",
        "Tier 4-8"
      ]
    },
    "Tier 5": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 4'].level > 0;
          },
      price: 130000,
      "power": 2600,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 5-1",
        "Tier 5-2",
        "Tier 5-3",
        "Tier 5-4",
        "Tier 5-5",
        "Tier 5-6",
        "Tier 5-7",
        "Tier 5-8"
      ]
    },
    "Tier 6": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 5'].level > 0;
          },
      price: 1400000,
      "power": 14000,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 6-1",
        "Tier 6-2",
        "Tier 6-3",
        "Tier 6-4",
        "Tier 6-5",
        "Tier 6-6",
        "Tier 6-7",
        "Tier 6-8"
      ]
    },
    "Tier 7": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 6'].level > 0;
          },
      price: 2000000,
      "power": 78000,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 7-1",
        "Tier 7-2",
        "Tier 7-3",
        "Tier 7-4",
        "Tier 7-5",
        "Tier 7-6",
        "Tier 7-7",
        "Tier 7-8"
      ]
    },
    "Tier 8": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 7'].level > 0;
          },
      price: 330000000,
      "power": 440000,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 8-1",
        "Tier 8-2",
        "Tier 8-3",
        "Tier 8-4",
        "Tier 8-5",
        "Tier 8-6",
        "Tier 8-7",
        "Tier 8-8"
      ]
    },
    "Tier 9": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 8'].level > 0;
          },
      price: 5100000000,
      "power": 2600000,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 9-1",
        "Tier 9-2",
        "Tier 9-3",
        "Tier 9-4",
        "Tier 9-5",
        "Tier 9-6",
        "Tier 9-7",
        "Tier 9-8"
      ]
    },
    "Tier 10": {
        visible : function () {
            return $scope.player.data.elements[$scope.current_element].generators['Tier 9'].level > 0;
          },
      price: 75000000000,
      "power": 16000000,
      "priceIncrease": 1.05,
      "upgrades": [
        "Tier 10-1",
        "Tier 10-2",
        "Tier 10-3",
        "Tier 10-4",
        "Tier 10-5",
        "Tier 10-6",
        "Tier 10-7",
        "Tier 10-8"
      ]
    }
  };

  $scope.visibleUpgrade = function(name){
	  var upgrade = $scope.upgrades[name];
	  var condition = "";
	  for(var pre in upgrade.preconditions){
		  condition += upgrade.preconditions[pre]+" && ";
	  }
	  for(var dep in upgrade.dependencies){
		  condition += "$scope.player.data.elements[$scope.current_element].upgrades['"+upgrade.dependencies[dep]+"'].bought"+" && ";
	  }
	  condition += "true";
	  return eval(condition);
  }
  
  $scope.upgradeApply = function(resource, power){
	  return resource * power;
  };
  
  $scope.upgrades = {
    "Tier 1-1": {
      "price": 100,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 1'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 1-2": {
      "price": 500,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 1-1"
      ],
      "power": 3
    },
    "Tier 1-3": {
      "price": 10000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 1-2"
      ],
      "power": 4
    },
    "Tier 1-4": {
      "price": 100000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 1-3"
      ],
      "power": 5
    },
    "Tier 1-5": {
      "price": 10000000,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 1-4"
      ],
      "power": 6
    },
    "Tier 1-6": {
      "price": 100000000,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 1-5"
      ],
      "power": 7
    },
    "Tier 1-7": {
      "price": 1000000000,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 1-6"
      ],
      "power": 8
    },
    "Tier 1-8": {
      "price": 10000000000,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 1-7"
      ],
      "power": 9
    },
    "Tier 2-1": {
      "price": 1000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 2'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 2-2": {
      "price": 5000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 2-1"
      ],
      "power": 3
    },
    "Tier 2-3": {
      "price": 50000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 2-2"
      ],
      "power": 4
    },
    "Tier 2-4": {
      "price": 5000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 2-3"
      ],
      "power": 5
    },
    "Tier 2-5": {
      "price": 500000000,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 2-4"
      ],
      "power": 6
    },
    "Tier 2-6": {
      "price": 50000000000,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 2-5"
      ],
      "power": 7
    },
    "Tier 2-7": {
      "price": 50000000000000,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 2-6"
      ],
      "power": 8
    },
    "Tier 2-8": {
      "price": 5.0e+16,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 2-7"
      ],
      "power": 9
    },
    "Tier 3-1": {
      "price": 10000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 3'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 3-2": {
      "price": 55000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 3-1"
      ],
      "power": 3
    },
    "Tier 3-3": {
      "price": 550000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 3-2"
      ],
      "power": 4
    },
    "Tier 3-4": {
      "price": 55000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 3-3"
      ],
      "power": 5
    },
    "Tier 3-5": {
      "price": 5500000000,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 3-4"
      ],
      "power": 6
    },
    "Tier 3-6": {
      "price": 550000000000,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 3-5"
      ],
      "power": 7
    },
    "Tier 3-7": {
      "price": 5.5e+14,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 3-6"
      ],
      "power": 8
    },
    "Tier 3-8": {
      "price": 5.5e+17,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 3-7"
      ],
      "power": 9
    },
    "Tier 4-1": {
      "price": 120000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 4'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 4-2": {
      "price": 600000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 4-1"
      ],
      "power": 3
    },
    "Tier 4-3": {
      "price": 6000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 4-2"
      ],
      "power": 4
    },
    "Tier 4-4": {
      "price": 600000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 4-3"
      ],
      "power": 5
    },
    "Tier 4-5": {
      "price": 60000000000,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 4-4"
      ],
      "power": 6
    },
    "Tier 4-6": {
      "price": 6000000000000,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 4-5"
      ],
      "power": 7
    },
    "Tier 4-7": {
      "price": 6.0e+15,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 4-6"
      ],
      "power": 8
    },
    "Tier 4-8": {
      "price": 6.0e+18,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 4-7"
      ],
      "power": 9
    },
    "Tier 5-1": {
      "price": 1300000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 5'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 5-2": {
      "price": 6500000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 5-1"
      ],
      "power": 3
    },
    "Tier 5-3": {
      "price": 65000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 5-2"
      ],
      "power": 4
    },
    "Tier 5-4": {
      "price": 6500000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 5-3"
      ],
      "power": 5
    },
    "Tier 5-5": {
      "price": 650000000000,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 5-4"
      ],
      "power": 6
    },
    "Tier 5-6": {
      "price": 65000000000000,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 5-5"
      ],
      "power": 7
    },
    "Tier 5-7": {
      "price": 6.5e+16,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 5-6"
      ],
      "power": 8
    },
    "Tier 5-8": {
      "price": 6.5e+19,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 5-7"
      ],
      "power": 9
    },
    "Tier 6-1": {
      "price": 14000000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 6'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 6-2": {
      "price": 70000000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 6-1"
      ],
      "power": 3
    },
    "Tier 6-3": {
      "price": 700000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 6-2"
      ],
      "power": 4
    },
    "Tier 6-4": {
      "price": 70000000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 6-3"
      ],
      "power": 5
    },
    "Tier 6-5": {
      "price": 7000000000000,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 6-4"
      ],
      "power": 6
    },
    "Tier 6-6": {
      "price": 7.0e+14,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 6-5"
      ],
      "power": 7
    },
    "Tier 6-7": {
      "price": 7.0e+17,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 6-6"
      ],
      "power": 8
    },
    "Tier 6-8": {
      "price": 7.0e+20,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 6-7"
      ],
      "power": 9
    },
    "Tier 7-1": {
      "price": 200000000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 7'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 7-2": {
      "price": 1000000000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 7-1"
      ],
      "power": 3
    },
    "Tier 7-3": {
      "price": 10000000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 7-2"
      ],
      "power": 4
    },
    "Tier 7-4": {
      "price": 1000000000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 7-3"
      ],
      "power": 5
    },
    "Tier 7-5": {
      "price": 1.0e+14,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 7-4"
      ],
      "power": 6
    },
    "Tier 7-6": {
      "price": 1.0e+16,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 7-5"
      ],
      "power": 7
    },
    "Tier 7-7": {
      "price": 1.0e+19,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 7-6"
      ],
      "power": 8
    },
    "Tier 7-8": {
      "price": 1.0e+22,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 7-7"
      ],
      "power": 9
    },
    "Tier 8-1": {
      "price": 3300000000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 8'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 8-2": {
      "price": 16500000000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 8-1"
      ],
      "power": 3
    },
    "Tier 8-3": {
      "price": 165000000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 8-2"
      ],
      "power": 4
    },
    "Tier 8-4": {
      "price": 16500000000000,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 8-3"
      ],
      "power": 5
    },
    "Tier 8-5": {
      "price": 1.65e+15,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 8-4"
      ],
      "power": 6
    },
    "Tier 8-6": {
      "price": 1.65e+17,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 8-5"
      ],
      "power": 7
    },
    "Tier 8-7": {
      "price": 1.65e+20,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 8-6"
      ],
      "power": 8
    },
    "Tier 8-8": {
      "price": 1.65e+23,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 8-7"
      ],
      "power": 9
    },
    "Tier 9-1": {
      "price": 51000000000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 9'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 9-2": {
      "price": 255000000000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 9-1"
      ],
      "power": 3
    },
    "Tier 9-3": {
      "price": 2550000000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 9-2"
      ],
      "power": 4
    },
    "Tier 9-4": {
      "price": 2.55e+14,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 9-3"
      ],
      "power": 5
    },
    "Tier 9-5": {
      "price": 2.55e+16,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 9-4"
      ],
      "power": 6
    },
    "Tier 9-6": {
      "price": 2.55e+18,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 9-5"
      ],
      "power": 7
    },
    "Tier 9-7": {
      "price": 2.55e+21,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 9-6"
      ],
      "power": 8
    },
    "Tier 9-8": {
      "price": 2.55e+24,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 9-7"
      ],
      "power": 9
    },
    "Tier 10-1": {
      "price": 750000000000,
      "description": "x2",
      "preconditions": [
        "$scope.player.data.unlocks.upgrade",
        "$scope.player.data.elements[$scope.current_element].generators['Tier 10'].level > 0"
      ],
      "dependencies": [],
      "power": 2
    },
    "Tier 10-2": {
      "price": 3750000000000,
      "description": "x3",
      "preconditions": [],
      "dependencies": [
        "Tier 10-1"
      ],
      "power": 3
    },
    "Tier 10-3": {
      "price": 37500000000000,
      "description": "x4",
      "preconditions": [],
      "dependencies": [
        "Tier 10-2"
      ],
      "power": 4
    },
    "Tier 10-4": {
      "price": 3.75e+15,
      "description": "x5",
      "preconditions": [],
      "dependencies": [
        "Tier 10-3"
      ],
      "power": 5
    },
    "Tier 10-5": {
      "price": 3.75e+17,
      "description": "x6",
      "preconditions": [],
      "dependencies": [
        "Tier 10-4"
      ],
      "power": 6
    },
    "Tier 10-6": {
      "price": 3.75e+19,
      "description": "x7",
      "preconditions": [],
      "dependencies": [
        "Tier 10-5"
      ],
      "power": 7
    },
    "Tier 10-7": {
      "price": 3.75e+22,
      "description": "x8",
      "preconditions": [],
      "dependencies": [
        "Tier 10-6"
      ],
      "power": 8
    },
    "Tier 10-8": {
      "price": 3.75e+25,
      "description": "x9",
      "preconditions": [],
      "dependencies": [
        "Tier 10-7"
      ],
      "power": 9
    }
  };

  $scope.resources = {
    'H' : {
      visible : function () {
        return $scope.current_element === "H" && $scope.current_tab == "Elements";
      },
      ratio : 0.999884,
      type : 'element'
    },
    'H-' : {
      visible : function () {
        return $scope.current_element === "H" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['H-'].unlocked;
      },
      html : 'H<sup>-</sup>',
      type : 'ion',
      charge : +1
    },
    '2H' : {
      visible : function () {
        return $scope.current_element === "H" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['2H'].unlocked;
      },
      ratio : 0.000115,
      html : '<sup>2</sup>H',
      type : 'isotope'
    },
    '3H' : {
      visible : function () {
        return $scope.current_element === "H" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['3H'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>3</sup>H',
      type : 'isotope',
      decay : {
        half_life : 3.8852e+8,
        decay_type : 'beta-',
        decay_product : {
          '3He+1' : 1,
          'e-' : 1,
          'eV' : 18610
        }
      }
    },
    'H2' : {
      visible : function () {
        return $scope.current_element === "H" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources.H2.unlocked;
      },
      html : 'H<sub>2</sub>',
      type : 'allotrope'
    },
    'He' : {
      visible : function () {
        return $scope.current_element === "He" && $scope.current_tab == "Elements";
      },
      ratio : 0.999998,
      type : 'element',
    },
    '3He' : {
      visible : function () {
        return $scope.current_element === "He" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['3He'].unlocked;
      },
      ratio : 0.000002,
      html : '<sup>3</sup>He',
      type : 'isotope',
    },
    '3He+1' : {
      visible : function () {
        return $scope.current_element === "He" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['3He+1'].unlocked;
      },
      html : '<sup>3</sup>He<sup>+</sup>',
      type : [ 'isotope', 'ion' ]
    },
    'Li' : {
      visible : function () {
        return $scope.current_element === "Li" && $scope.current_tab == "Elements";
      },
      ratio : 0.95,
      type : 'element',
    },
    '7Li' : {
      visible : function () {
        return $scope.current_element === "Li" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['7Li'].unlocked;
      },
      ratio : 0.05,
      html : '<sup>7</sup>Li',
      type : 'isotope',
    },
    'Be' : {
      visible : function () {
        return $scope.current_element === "Be" && $scope.current_tab == "Elements";
      },
      ratio : 0.999998,
      type : 'element',
    },
    '7Be' : {
      visible : function () {
        return $scope.current_element === "Be" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['7Be'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>7</sup>Be',
      type : 'isotope',
      decay : {
        half_life : 4589568,
        decay_type : 'electron-capture',
        decay_product : {
          '7Li' : 1,
          'eV' : 862000
        }
      }
    },
    '10Be' : {
      visible : function () {
        return $scope.current_element === "Be" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['10Be'].unlocked;
      },
      ratio : 0.000001,
      type : 'isotope',
      html : '<sup>10</sup>Be',
      decay : {
        half_life : 4.2917e+14,
        decay_type : 'beta-',
        decay_product : {
          '10B' : 1,
          'e-' : 1,
          'eV' : 556000
        }
      }
    },
    'B' : {
      visible : function () {
        return $scope.current_element === "B" && $scope.current_tab == "Elements";
      },
      ratio : 0.2,
      type : 'element',
    },
    '11B' : {
      visible : function () {
        return $scope.current_element === "B" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['11B'].unlocked;
      },
      ratio : 0.8,
      html : '<sup>11</sup>B',
      type : 'isotope',
    },
    'C' : {
      visible : function () {
        return $scope.current_element === "C" && $scope.current_tab == "Elements";
      },
      ratio : 0.988998,
      type : 'element',
    },
    '11C' : {
      visible : function () {
        return $scope.current_element === "C" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['11C'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>11</sup>C',
      type : 'isotope',
      decay : {
        half_life : 1200,
        decay_type : 'beta+',
        decay_product : {
          '11B' : 1,
          'e+' : 1,
          'eV' : 96000
        }
      }
    },
    '13C' : {
      visible : function () {
        return $scope.current_element === "C" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['13C'].unlocked;
      },
      ratio : 0.011,
      html : '<sup>13</sup>C',
      type : 'isotope',
    },
    '14C' : {
      visible : function () {
        return $scope.current_element === "C" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['14C'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>14</sup>C',
      type : 'isotope',
      decay : {
        half_life : 1.807e+11,
        decay_type : 'beta-',
        decay_product : {
          '14N' : 1,
          'e-' : 1,
          'eV' : 156000
        }
      }
    },
    'N' : {
      visible : function () {
        return $scope.current_element === "N" && $scope.current_tab == "Elements";
      },
      ratio : 0.959999,
      type : 'element',
    },
    '13N' : {
      visible : function () {
        return $scope.current_element === "N" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['13N'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>13</sup>N',
      type : 'isotope',
      decay : {
        half_life : 598,
        decay_type : 'electron-capture',
        decay_product : {
          '13C' : 1,
          'eV' : 2220000
        }
      }
    },
    '15N' : {
      visible : function () {
        return $scope.current_element === "N" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['15N'].unlocked;
      },
      ratio : 0.04,
      html : '<sup>15</sup>N',
      type : 'isotope',
    },
    'O' : {
      visible : function () {
        return $scope.current_element === "O" && $scope.current_tab == "Elements";
      },
      ratio : 0.9976,
      type : 'element'
    },
    'O2' : {
      visible : function () {
        return $scope.current_element === "O" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources.O2.unlocked;
      },
      html : 'O<sub>2</sub>',
      type : 'molecule',
    },
    'O3' : {
      visible : function () {
        return $scope.current_element === "O" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources.O3.unlocked;
      },
      html : 'O<sub>3</sub>',
      type : 'molecule'
    },
    '17O' : {
      visible : function () {
        return $scope.current_element === "O" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['17O'].unlocked;
      },
      ratio : 0.00039,
      html : '<sup>17</sup>O',
      type : 'isotope'
    },
    '18O' : {
      visible : function () {
        return $scope.current_element === "O" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['18O'].unlocked;
      },
      ratio : 0.00201,
      html : '<sup>18</sup>O',
      type : 'isotope'
    },
    'H2O' : {
      visible : function () {
        return ($scope.current_element === "H" || $scope.current_element === "O") &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources.H2O.unlocked;
      },
      html : 'H<sub>2</sub>O',
      type : 'molecule'
    },
    'F' : {
      visible : function () {
        return $scope.current_element === "F" && $scope.current_tab == "Elements";
      },
      ratio : 0.999998,
      type : 'element',
    },
    '18F' : {
      visible : function () {
        return $scope.current_element === "F" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['18F'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>18</sup>F',
      type : 'isotope',
      decay : {
        half_life : 6586,
        decay_type : 'beta+',
        decay_product : {
          '18O' : 1,
          'e+' : 1,
          'eV' : 634000
        }
      }
    },
    'Ne' : {
      visible : function () {
        return $scope.current_element === "Ne" && $scope.current_tab == "Elements";
      },
      ratio : 0.9048,
      type : 'element',
    },
    '21Ne' : {
      visible : function () {
        return $scope.current_element === "Ne" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['21Ne'].unlocked;
      },
      ratio : 0.0027,
      html : '<sup>21</sup>Ne',
      type : 'isotope',
    },
    '22Ne' : {
      visible : function () {
        return $scope.current_element === "Ne" &&
               $scope.current_tab == "Elements" &&
               $scope.player.data.resources['22Ne'].unlocked;
      },
      ratio : 0.0925,
      html : '<sup>22</sup>Ne',
      type : 'isotope',
    },
    'e-' : {
      visible : function () {
        return $scope.player.data.resources['e-'].unlocked;
      },
      type : 'subatomic'
    },
    'n' : {
      visible : function () {
        return $scope.player.data.resources.n.unlocked;
      },
      type : 'subatomic'
    },
    'p' : {
      visible : function () {
        return $scope.player.data.resources.p.unlocked;
      },
      type : 'subatomic'
    },
    'eV' : {
      visible : function () {
        return $scope.player.data.resources.eV.unlocked;
      },
      type : 'eV'
    }
  };

  $scope.radioisotopes = [ '3H' ];// ,'7Be','10Be','11C','14C','13N','18F'];

  $scope.tabs = {
    'Elements' : {
      visible : function () {
        return true;
      },
      has_new : function () {
        for ( var key in $scope.elements) {
          if ($scope.player.data.elements[key] !== undefined &&
              $scope.player.data.elements[key].unlocked &&
              $scope.elements[key].has_new()) {
            return true;
          }
        }
        var other = [ 'e-', 'n', 'p', 'eV' ];
        for ( var key in other) {
          if ($scope.player.data.resources[other[key]].unlocked && $scope.player.data.resources[other[key]].is_new) {
            return true;
          }
        }
        return false;
      },
    },
    'Encyclopedia' : {
      visible : function () {
        return $scope.player.data.intro.content;
      },
      has_new : function () {
        for ( var key in $scope.player.data.encyclopedia) {
          if ($scope.encyclopedia[key].visible() && $scope.player.data.encyclopedia[key].is_new) {
            return true;
          }
        }

        return false;
      },
    },
    'Periodic Table' : {
      visible : function () {
        return $scope.player.data.unlocks.periodic_table;
      },
      has_new : function () {
        return false;
      },
    },
    'Options' : {
      visible : function () {
        return $scope.player.data.intro.content;
      },
      has_new : function () {
        return false;
      },
    }
  };

  $scope.encyclopedia = {
    'Hydrogen' : {
      visible : function () {
        return true;
      },
      link : 'https://en.wikipedia.org/wiki/Hydrogen',
    },
    'Helium' : {
      visible : function () {
        return $scope.player.data.unlocks.helium;
      },
      link : 'https://en.wikipedia.org/wiki/Helium',
    },
    'Lithium' : {
      visible : function () {
        return $scope.player.data.unlocks.lithium;
      },
      link : 'https://en.wikipedia.org/wiki/Lithium',
    },
    'Beryllium' : {
      visible : function () {
        return $scope.player.data.unlocks.beryllium;
      },
      link : 'https://en.wikipedia.org/wiki/Beryllium',
    },
    'Boron' : {
      visible : function () {
        return $scope.player.data.unlocks.boron;
      },
      link : 'https://en.wikipedia.org/wiki/Boron',
    },
    'Carbon' : {
      visible : function () {
        return $scope.player.data.unlocks.carbon;
      },
      link : 'https://en.wikipedia.org/wiki/Carbon',
    },
    'Nitrogen' : {
      visible : function () {
        return $scope.player.data.unlocks.nitrogen;
      },
      link : 'https://en.wikipedia.org/wiki/Nitrogen',
    },
    'Oxygen' : {
      visible : function () {
        return $scope.player.data.unlocks.oxygen;
      },
      link : 'https://en.wikipedia.org/wiki/Oxygen',
    },
    'Fluorine' : {
      visible : function () {
        return $scope.player.data.unlocks.fluorine;
      },
      link : 'https://en.wikipedia.org/wiki/Fluorine',
    },
    'Neon' : {
      visible : function () {
        return $scope.player.data.unlocks.neon;
      },
      link : 'https://en.wikipedia.org/wiki/Neon',
    },
    'Isotope' : {
      visible : function () {
        return $scope.player.data.unlocks.isotope;
      },
      link : 'https://en.wikipedia.org/wiki/Isotope',
    },
    'Electron' : {
      visible : function () {
        return $scope.player.data.unlocks.electron;
      },
      link : 'https://en.wikipedia.org/wiki/Electron',
    },
    'Proton' : {
      visible : function () {
        return $scope.player.data.unlocks.proton;
      },
      link : 'https://en.wikipedia.org/wiki/Proton',
    },
    'Neutron' : {
      visible : function () {
        return $scope.player.data.unlocks.neutron;
      },
      link : 'https://en.wikipedia.org/wiki/Neutron',
    },
    'Radioactivity' : {
      visible : function () {
        return $scope.player.data.unlocks.radioactivity;
      },
      link : 'https://en.wikipedia.org/wiki/Radioactive_decay',
    },
    'Half-life' : {
      visible : function () {
        return $scope.player.data.unlocks.half_life;
      },
      link : 'https://en.wikipedia.org/wiki/Half-life',
    },
    'Beta decay' : {
      visible : function () {
        return $scope.player.data.unlocks.beta_decay;
      },
      link : 'https://en.wikipedia.org/wiki/Beta_decay',
    },
    'Energy' : {
      visible : function () {
        return $scope.player.data.unlocks.energy;
      },
      link : 'https://en.wikipedia.org/wiki/Energy',
    },
    'Electronvolt' : {
      visible : function () {
        return $scope.player.data.unlocks.energy;
      },
      link : 'https://en.wikipedia.org/wiki/Electronvolt',
    },
    'Ionization energy' : {
      visible : function () {
        return $scope.player.data.unlocks.ionization_energy;
      },
      link : 'https://en.wikipedia.org/wiki/Ionization_energy',
    },
    'Electron affinity' : {
      visible : function () {
        return $scope.player.data.unlocks.electron_affinity;
      },
      link : 'https://en.wikipedia.org/wiki/Electron_affinity',
    },
    'Nuclear binding energy' : {
      visible : function () {
        return $scope.player.data.unlocks.nuclear_binding_energy;
      },
      link : 'https://en.wikipedia.org/wiki/Nuclear_binding_energy',
    },
    'Synthesis' : {
      visible : function () {
        return $scope.player.data.unlocks.synthesis;
      },
      link : 'https://en.wikipedia.org/wiki/Chemical_synthesis',
    },
    'Ion' : {
      visible : function () {
        return $scope.player.data.unlocks.ion;
      },
      link : 'https://en.wikipedia.org/wiki/Ion',
    },
    'Molecule' : {
      visible : function () {
        return $scope.player.data.unlocks.molecule;
      },
      link : 'https://en.wikipedia.org/wiki/Molecule',
    },
    'Allotrope' : {
      visible : function () {
        return $scope.player.data.unlocks.allotrope;
      },
      link : 'https://en.wikipedia.org/wiki/Allotropy',
    }
  };

  $scope.reactions = {
    'H' : {
      'ionization' : {
        1 : {
          reactant : {
            'eV' : 13.5984,
            'H' : 1
          },
          product : {
            'p' : 1,
            'e-' : 1
          },
          visible : function () {
            return $scope.player.data.unlocks.ionization_energy;
          }
        }
      },
      'electron_affinity' : {
        1 : {
          reactant : {
            'e-' : 1,
            'H' : 1
          },
          product : {
            'H-' : 1,
            'eV' : 0.7545
          },
          visible : function () {
            return $scope.player.data.unlocks.electron_affinity;
          }
        }
      },
      'binding_energy' : {
        1 : {
          reactant : {
            'eV' : 2224520,
            '2H' : 1
          },
          product : {
            'p' : 1,
            'n' : 1,
            'e-' : 1
          },
          visible : function () {
            return $scope.player.data.unlocks.nuclear_binding_energy && $scope.player.data.resources['2H'].unlocked;
          }
        },
        2 : {
          reactant : {
            'eV' : 2827266,
            '3H' : 1
          },
          product : {
            'p' : 1,
            'n' : 2,
            'e-' : 1
          },
          visible : function () {
            return $scope.player.data.unlocks.nuclear_binding_energy && $scope.player.data.resources['3H'].unlocked;
          }
        }
      },
      // We could create a function that checks for every synthesis if
      // one of the reactants is an isotope, ion or molecule of the element
      // However for the sake of a proof of concept that is beyond our scope
      'synthesis' : [ 'H-p', 'H2O' ]
    },
    'O' : {
      'ionization' : {},
      'electron_affinity' : {},
      'binding_energy' : {
        1 : {
          reactant : {
            'eV' : 128030000,
            'O' : 1
          },
          product : {
            'p' : 8,
            'n' : 8,
            'e-' : 8
          },
          visible : function () {
            return $scope.player.data.unlocks.nuclear_binding_energy && $scope.player.data.resources.O.unlocked;
          }
        },
        2 : {
          reactant : {
            'eV' : 131750000,
            '17O' : 1
          },
          product : {
            'p' : 8,
            'n' : 9,
            'e-' : 8
          },
          visible : function () {
            return $scope.player.data.unlocks.nuclear_binding_energy && $scope.player.data.resources['17O'].unlocked;
          }
        },
        3 : {
          reactant : {
            'eV' : 141170000,
            '18O' : 1
          },
          product : {
            'p' : 8,
            'n' : 10,
            'e-' : 8
          },
          visible : function () {
            return $scope.player.data.unlocks.nuclear_binding_energy && $scope.player.data.resources['18O'].unlocked;
          }
        }
      },
      'synthesis' : [ 'O3', 'O2-OO', 'H2O', 'O2O2-O3O' ]
    }
  };

  $scope.synthesis = {
    'H-p' : {
      reactant : {
        'H-' : 1,
        'p' : 1
      },
      product : {
        'H2' : 1,
        'eV' : 17.3705
      },
      visible : function () {
        return $scope.player.data.unlocks.synthesis &&
               $scope.player.data.resources['H-'].unlocked &&
               $scope.player.data.resources.p.unlocked &&
               $scope.current_element == "H";
      }
    },
    'O3' : {
      reactant : {
        'O3' : 1,
        'eV' : 4.43
      },
      product : {
        'O2' : 1,
        'O' : 1
      },
      visible : function () {
        return $scope.player.data.unlocks.synthesis &&
               $scope.player.data.resources.O3.unlocked &&
               $scope.player.data.resources.eV.unlocked &&
               $scope.current_element == "O";
      }
    },
    'O2-OO' : {
      reactant : {
        'O2' : 1,
        'eV' : 21.4219
      },
      product : {
        'O' : 2
      },
      visible : function () {
        return $scope.player.data.unlocks.synthesis &&
               $scope.player.data.resources.O2.unlocked &&
               $scope.player.data.resources.eV.unlocked &&
               $scope.current_element == "O";
      }
    },
    'O2O2-O3O' : {
      reactant : {
        'O2' : 2,
        'eV' : 18
      },
      product : {
        'O3' : 1,
        'O' : 1
      },
      visible : function () {
        return $scope.player.data.unlocks.synthesis &&
               $scope.player.data.resources.O2.unlocked &&
               $scope.player.data.resources.O3.unlocked &&
               $scope.player.data.resources.eV.unlocked &&
               $scope.current_element == "O";
      }
    },
    'H2O' : {
      reactant : {
        'H2' : 2,
        'O2' : 1
      },
      product : {
        'H2O' : 2,
        'eV' : 5.925
      },
      visible : function () {
        return $scope.player.data.unlocks.synthesis &&
               $scope.player.data.resources.O.number > 1e8 &&
               $scope.player.data.resources.H.number > 1e14 &&
               ($scope.current_element == "H" || $scope.current_element == "O");
      }
    }
  };

  $scope.html = {
    'beta-' : '&#946;<sup>-</sup>',
    'beta+' : '&#946;<sup>+</sup>',
    'electron-capture' : '&#x3B5'
  };

  $scope.unlocks = {
    "hydrogen" : {
      check : function (event, data) {
        // $scope.achievement.addToast("Periodic table");
        $scope.player.data.unlocks.hydrogen = true;
        $scope.unlocks.hydrogen.listener();
      },
      event : "cycle"
    },
    "periodic_table" : {
      check : function (event, data) {
        if ($scope.player.data.resources['e-'].unlocked &&
            $scope.player.data.resources.p.unlocked &&
            $scope.player.data.resources.n.unlocked) {
          $scope.achievement.addToast("Periodic table");
          $scope.player.data.unlocks.periodic_table = true;
          $scope.unlocks.periodic_table.listener();
        }
      },
      event : "cycle"
    },
    "isotope" : {
      check : function (event, data) {
        if ([ '2H', '3H' ].indexOf(data) != -1) {
          $scope.achievement.addToast("Isotope");
          $scope.player.data.unlocks.isotope = true;
          $scope.unlocks.isotope.listener();
        }
      },
      event : "resource"
    },
    "ion" : {
      check : function (event, data) {
        if ("H-" == data) {
          $scope.achievement.addToast("Ion");
          $scope.player.data.unlocks.ion = true;
          $scope.unlocks.ion.listener();
        }
      },
      event : "resource"
    },
    "radioactivity" : {
      check : function (event, data) {
        if ("3H" == data) {
          $scope.achievement.addToast("Radioactivity");
          $scope.player.data.unlocks.radioactivity = true;
          $scope.unlocks.radioactivity.listener();
        }
      },
      event : "resource"
    },
    "allotrope" : {
      check : function (event, data) {
        if ([ 'O2', 'O3' ].indexOf(data) != -1) {
          $scope.achievement.addToast("Allotrope");
          $scope.player.data.unlocks.allotrope = true;
          $scope.unlocks.allotrope.listener();
        }
      },
      event : "resource"
    },
    "reactions" : {
      check : function (event, data) {
        if ("e-" == data) {
          $scope.achievement.addToast("Reactions");
          $scope.player.data.unlocks.reactions = true;
          $scope.unlocks.reactions.listener();
        }
      },
      event : "resource"
    },
    "electron" : {
      check : function (event, data) {
        if ("e-" == data) {
          $scope.achievement.addToast("Electron");
          $scope.player.data.unlocks.electron = true;
          $scope.unlocks.electron.listener();
        }
      },
      event : "resource"
    },
    "proton" : {
      check : function (event, data) {
        if ("p" == data) {
          $scope.achievement.addToast("Proton");
          $scope.player.data.unlocks.proton = true;
          $scope.unlocks.proton.listener();
        }
      },
      event : "resource"
    },
    "neutron" : {
      check : function (event, data) {
        if ("n" == data) {
          $scope.achievement.addToast("Neutron");
          $scope.player.data.unlocks.neutron = true;
          $scope.unlocks.neutron.listener();
        }
      },
      event : "resource"
    },
    "energy" : {
      check : function (event, data) {
        if ("eV" == data) {
          $scope.achievement.addToast("Energy");
          $scope.player.data.unlocks.energy = true;
          $scope.unlocks.energy.listener();
        }
      },
      event : "resource"
    },
    "half_life" : {
      check : function (event, data) {
        if ("3H" == data) {
          $scope.achievement.addToast("Half-life");
          $scope.player.data.unlocks.half_life = true;
          $scope.unlocks.half_life.listener();
        }
      },
      event : "resource"
    },
    "oxygen" : {
      check : function (event, data) {
        if ("O" == data) {
          $scope.achievement.addToast("Oxygen");
          $scope.player.data.unlocks.oxygen = true;
          $scope.unlocks.oxygen.listener();
        }
      },
      event : "element"
    },
    "upgrade" : {
      check : function (event, data) {
        if ("Tier 3" == data) {
          $scope.achievement.addToast("Upgrades");
          $scope.player.data.unlocks.upgrade = true;
          $scope.unlocks.upgrade.listener();
        }
      },
      event : "generator"
    },
    "ionization_energy" : {
      check : function (event, data) {
        if ("e-" == data) {
          $scope.achievement.addToast("Ionization energy");
          $scope.player.data.unlocks.ionization_energy = true;
          $scope.unlocks.ionization_energy.listener();
        }
      },
      event : "resource"
    },
    "electron_affinity" : {
      check : function (event, data) {
        if ($scope.player.data.resources['e-'].number >= 10 && $scope.player.data.resources.p.number >= 10) {
          $scope.achievement.addToast("Electron affinity");
          $scope.player.data.unlocks.electron_affinity = true;
          $scope.unlocks.electron_affinity.listener();
        }
      },
      event : "cycle"
    },
    "nuclear_binding_energy" : {
      check : function (event, data) {
        if ($scope.player.data.resources['e-'].number >= 100 && $scope.player.data.resources.p.number >= 100) {
          $scope.achievement.addToast("Nuclear binding energy");
          $scope.player.data.unlocks.nuclear_binding_energy = true;
          $scope.unlocks.nuclear_binding_energy.listener();
        }
      },
      event : "cycle"
    },
    "beta_decay" : {
      check : function (event, data) {
        if ("beta-" == data) {
          $scope.achievement.addToast("Beta decay");
          $scope.player.data.unlocks.beta_decay = true;
          $scope.unlocks.beta_decay.listener();
        }
      },
      event : "decay"
    },
    "molecule" : {
      check : function (event, data) {
        if ("H2" == data || "O2" == data || "O3" == data) {
          $scope.achievement.addToast("Molecule");
          $scope.player.data.unlocks.molecule = true;
          $scope.unlocks.molecule.listener();
        }
      },
      event : "resource"
    },
    "synthesis" : {
      check : function (event, data) {
        if ($scope.player.data.resources['H-'].number >= 10) {
          $scope.achievement.addToast("Synthesis");
          $scope.player.data.unlocks.synthesis = true;
          $scope.unlocks.synthesis.listener();
        }
      },
      event : "cycle"
    },
    "helium" : {
      check : function (event, data) {
        if ("He" == data) {
          $scope.achievement.addToast("Helium");
          $scope.player.data.unlocks.helium = true;
          $scope.unlocks.helium.listener();
        }
      },
      event : "element"
    },
    "lithium" : {
      check : function (event, data) {
        if ("Li" == data) {
          $scope.achievement.addToast("Lithium");
          $scope.player.data.unlocks.lithium = true;
          $scope.unlocks.lithium.listener();
        }
      },
      event : "element"
    },
    "beryllium" : {
      check : function (event, data) {
        if ("Be" == data) {
          $scope.achievement.addToast("Beryllium");
          $scope.player.data.unlocks.beryllium = true;
          $scope.unlocks.beryllium.listener();
        }
      },
      event : "element"
    },
    "boron" : {
      check : function (event, data) {
        if ("B" == data) {
          $scope.achievement.addToast("Boron");
          $scope.player.data.unlocks.boron = true;
          $scope.unlocks.boron.listener();
        }
      },
      event : "element"
    },
    "carbon" : {
      check : function (event, data) {
        if ("C" == data) {
          $scope.achievement.addToast("Carbon");
          $scope.player.data.unlocks.carbon = true;
          $scope.unlocks.carbon.listener();
        }
      },
      event : "element"
    },
    "nitrogen" : {
      check : function (event, data) {
        if ("N" == data) {
          $scope.achievement.addToast("Nitrogen");
          $scope.player.data.unlocks.nitrogen = true;
          $scope.unlocks.nitrogen.listener();
        }
      },
      event : "element"
    },
    "fluorine" : {
      check : function (event, data) {
        if ("F" == data) {
          $scope.achievement.addToast("Fluorine");
          $scope.player.data.unlocks.fluorine = true;
          $scope.unlocks.fluorine.listener();
        }
      },
      event : "element"
    },
    "neon" : {
      check : function (event, data) {
        if ("Ne" == data) {
          $scope.achievement.addToast("Neon");
          $scope.player.data.unlocks.neon = true;
          $scope.unlocks.neon.listener();
        }
      },
      event : "element"
    }
  };

  $scope.periodic_table = [
      [ 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'He' ],
      [ 'Li', 'Be', '', '', '', '', '', '', '', '', '', '', 'B', 'C', 'N', 'O', 'F', 'Ne' ],
      [ 'Na', 'Mg', '', '', '', '', '', '', '', '', '', '', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar' ],
      [ 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr' ],
      [ 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe' ],
      [ 'Cs', 'Ba', '*', 'Hf', 'Ta', 'W', 'Re', 'Os', 'I', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn' ],
      [ 'Fr', 'Ra', '**', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og' ],
      [ '', '', '*', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu' ],
      [ '', '', '**', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr' ] ];
}
