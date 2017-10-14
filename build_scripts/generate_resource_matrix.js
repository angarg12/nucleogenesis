/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let elements = jsonfile.readFileSync('build/data/elements.json');

let matrix = {};

for (let i in elements) {
  let element = elements[i];
  matrix[element.number] = {};
  for(let isotope in element.isotopes){
    let number = parseInt(isotope, 10);
    matrix[element.number][number] = isotope;
  }
}

jsonfile.writeFileSync('build/data/resource_matrix.json', matrix, {
  spaces: 2
});
