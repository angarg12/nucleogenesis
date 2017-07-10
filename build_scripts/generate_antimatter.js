/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0] + '/data/resources.json');
let syntheses = jsonfile.readFileSync(args[0] + '/data/syntheses.json');

for (let i in resources) {
  let resource = resources[i];
  if (resource.anti_particle) {
    let anti = resource.anti_particle;
    if(typeof syntheses[anti+'-eV'] === 'undefined'){
      let key = i + '-eV';
      let synthesis = {
        'reactant': {},
        'product': {},
        'elements': []
      };
      synthesis.reactant[i] = 1;
      synthesis.reactant[anti] = 1;
      synthesis.product.eV = resource.rest_mass * 2;
      syntheses[key] = synthesis;
    }
  }
}

jsonfile.writeFileSync(args[0] + '/data/resources.json', resources, {
  spaces: 2
});
jsonfile.writeFileSync(args[0] + '/data/syntheses.json', syntheses, {
  spaces: 2
});
