/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');

let unlocks = jsonfile.readFileSync('build/data/unlocks.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

for(let element in elements){
  // Generate element unlocks
  unlocks[element] = {
    condition: 'player.elements.'+element
  };
}

jsonfile.writeFileSync('build/data/unlocks.json', unlocks, {
  spaces: 2
});
