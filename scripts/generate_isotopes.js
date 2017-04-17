'use strict';

var jsonfile = require('jsonfile');
var path = require('path');

var args = process.argv.slice(2);

var base_path = path.join(args[0],'/data');

var resources = jsonfile.readFileSync(path.join(base_path,'/resources.json'));
var elements = jsonfile.readFileSync(path.join(base_path,'/elements.json'));

for(var element in elements){
  elements[element].includes = elements[element].includes || [];

  var isotopes = elements[element].isotopes;
  var isotopes_array = [];
  for(var isotope in isotopes){
    resources[isotope] = {};
    resources[isotope].ratio = isotopes[isotope].ratio;
    resources[isotope].decay = isotopes[isotope].decay;
    resources[isotope].elements = [element];
    resources[isotope].html = "<sup>"+numberPrefix(isotope)+"</sup>"+element;

    elements[element].includes.push(isotope);
    isotopes_array.push(isotope);
  }
  elements[element].isotopes = isotopes_array;
}

function numberPrefix(string){
  return string.replace(/(^\d+)(.+$)/i,'$1');
}

jsonfile.writeFileSync(path.join(base_path,'/resources.json'), resources, {spaces:2});
jsonfile.writeFileSync(path.join(base_path,'/elements.json'), elements, {spaces:2});
