/*jslint node: true */
'use strict';

var jsonfile = require('jsonfile');
var path = require('path');

var args = process.argv.slice(2);

var base_path = path.join(args[0], '/data');

var resources = jsonfile.readFileSync(path.join(base_path, '/resources.json'));
var elements = jsonfile.readFileSync(path.join(base_path, '/elements.json'));
var redox = {};

for (var element in elements) {
  elements[element].includes = elements[element].includes || [];

  var isotopes = elements[element].isotopes;
  for (var isotope in isotopes) {
    elements[element].isotopes[isotope].oxides = [];
    for (var i = 0; i < elements[element].ionization_energy.length; i++) {
      var key = generateKey(isotope, i, "+");

      resources[key] = {};
      resources[key].elements = [element];
      resources[key].html = isotopePrefix(isotope) + element + cationPostfix(i);
      resources[key].charge = (i + 1);

      elements[element].includes.push(key);
      elements[element].isotopes[isotope].oxides.push(key);

      redox[key] = {};
      redox[key].reactant = {};
      var energy = elements[element].ionization_energy[i];
      redox[key].reactant[generateKey(isotope, i - 1, "+")] = 1;
      redox[key].reactant.eV = energy;
      redox[key].product = {};
      // 1H is unique!!
      if (isotope === "1H") {
        redox[key].product.p = 1;
      } else {
        redox[key].product[key] = 1;

      }
      redox[key].product["e-"] = 1;
    }
  }
}

function generateKey(isotope, i, sign) {
  if (i < 0) {
    return isotope;
  }
  var postfix = sign;
  if (i > 0) {
    postfix = (i + 1) + postfix;
  }
  return isotope + postfix;
}

function isotopePrefix(isotope) {
  var prefix = isotope.replace(/(^\d+)(.+$)/i, '$1');
  return "<sup>" + prefix + "</sup>";
}

function cationPostfix(index) {
  var prefix = "";
  if (index > 0) {
    prefix = (index + 1).toString();
  }
  return "<sup>" + prefix + "+<sup>";
}

jsonfile.writeFileSync(path.join(base_path, '/resources.json'), resources, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(base_path, '/elements.json'), elements, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(base_path, '/oxidation.json'), redox, {
  spaces: 2
});
