/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let generators = jsonfile.readFileSync('build/data/generators.json');
let upgrades = jsonfile.readFileSync('build/data/upgrades.json');

let slot = {};

slot.upgrades = {};
for (let upgrade in upgrades) {
  slot.upgrades[upgrade] = false;
}
slot.generators = {};
for (let generator in generators) {
  slot.generators[generator] = 0;
}

slot.reactions = [];
slot.redoxes = [];

jsonfile.writeFileSync('build/data/element_slot.json', slot, {
  spaces: 2
});
