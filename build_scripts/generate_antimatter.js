/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let reactions = jsonfile.readFileSync('build/data/reactions.json');

for (let i in resources) {
  let resource = resources[i];
  if (resource.anti_particle) {
    let anti = resource.anti_particle;
    if(typeof reactions[anti+'-eV'] === 'undefined'){
      let key = i + '-eV';
      let reaction = {
        'reactant': {},
        'product': {},
        'elements': []
      };
      reaction.reactant[i] = 1;
      reaction.reactant[anti] = 1;
      reaction.product.eV = resource.energy * 2;
      reactions[key] = reaction;
    }
  }
}

jsonfile.writeFileSync('build/data/resources.json', resources, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/reactions.json', reactions, {
  spaces: 2
});
