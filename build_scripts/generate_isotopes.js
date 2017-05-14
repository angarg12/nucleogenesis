/*jslint node: true */
'use strict';

var jsonfile = require('jsonfile');

var args = process.argv.slice(2);

var resources = jsonfile.readFileSync(args[0]+'/data/resources.json');
var elements = jsonfile.readFileSync(args[0]+'/data/elements.json');

for (var element in elements) {
  elements[element].includes = elements[element].includes || [];
  let exotic = 'x'+element;
  elements[element].exotic = exotic;

  resources[exotic] = {};
  resources[exotic].elements = {};
  resources[exotic].elements[element] = 1;

  var isotopes = elements[element].isotopes;
  for (var isotope in isotopes) {
    resources[isotope] = {};
    resources[isotope].ratio = isotopes[isotope].ratio;
    resources[isotope].decay = isotopes[isotope].decay;
    resources[isotope].elements = {};
    resources[isotope].elements[element] = 1;
    resources[isotope].html = isotopePrefix(isotope) + element;

    if(elements[element].includes.indexOf(isotope) === -1){
      elements[element].includes.push(isotope);
    }
  }
}

function isotopePrefix(isotope) {
  var prefix = isotope.replace(/(^\d+)(.+$)/i, '$1');
  return "<sup>" + prefix + "</sup>";
}

jsonfile.writeFileSync(args[0]+'/data/resources.json', resources, {
  spaces: 2
});
jsonfile.writeFileSync(args[0]+'/data/elements.json', elements, {
  spaces: 2
});
