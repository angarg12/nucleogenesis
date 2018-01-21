/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');

let unlocks = jsonfile.readFileSync('build/data/unlocks.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

for(let element in elements){
  // Generate element unlocks
  unlocks[element] = {
    'condition': ['(() => {',
      'for(let resource of data.elements.'+element+'.includes){',
      '  if(player.resources[resource] !== null){',
      '    return true;',
      '  }',
      '}',
      'return false;',
      '})()'
    ]
  };
}

jsonfile.writeFileSync('build/data/unlocks.json', unlocks, {
  spaces: 2
});
