/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let parser = require('molecular-parser');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0]+'/data/resources.json');
let elements = jsonfile.readFileSync(args[0]+'/data/elements.json');

for (let element in elements) {
  elements[element].syntheses = elements[element].syntheses || [];
}

let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(args[0]+'/data/raw_syntheses.txt')
});

let syntheses = {};
// for each reaction
lineReader.on('line', function (line) {
  let synthesis = parseSynthesis(line);
  let key = generateKey(synthesis);
  syntheses[key] = {};
  syntheses[key].reactant = vectorToMap(synthesis[0]);
  syntheses[key].product = vectorToMap(synthesis[1]);
  extractElements(syntheses[key], key);
});

lineReader.on('close', function () {
  jsonfile.writeFileSync(args[0]+'/data/resources.json', resources, {
    spaces: 2
  });
  jsonfile.writeFileSync(args[0]+'/data/elements.json', elements, {
    spaces: 2
  });
  jsonfile.writeFileSync(args[0]+'/data/syntheses.json', syntheses, {
    spaces: 2
  });
});

function vectorToMap(vector){
  let map = {};
  for(let i in vector){
    let resource = vector[i];
    if(elements[resource] !== undefined){
      resource = elements[resource].main;
    }
    map[resource] = map[resource]+1 || 1;
  }
  return map;
}

function extractElements(synthesis, key) {
  synthesis.elements = [];
  elementsFromHalf(synthesis.reactant, synthesis.elements, key);
  elementsFromHalf(synthesis.product, synthesis.elements, key);
}

function elementsFromHalf(half, synthElements, key){
  for (let molecule in half) {
    let breakdown = parser.decomposeFormula(molecule);
  	if (!resources[molecule] && !elements[molecule]) {
        resources[molecule] = {};
        resources[molecule].elements = breakdown;
        resources[molecule].html = generateHTML(breakdown);
        resources[molecule].type = ['molecule'];
      }
    for (let j in breakdown) {
      // we add the elements involved in both parts
      if (synthElements.indexOf(j) === -1) {
        synthElements.push(j);
      }
      if (elements[j].includes.indexOf(molecule) === -1) {
        elements[j].includes.push(molecule);
      }
      if (elements[j].syntheses.indexOf(key) === -1) {
        elements[j].syntheses.push(key);
      }
    }
  }
}

function generateKey(synthesis) {
  let key = '';
  for (let half in synthesis) {
    for (let i in synthesis[half]) {
      key += synthesis[half][i] + '.';
    }
    key = key.replace(/.$/, '');
    key += '-';
  }
  key = key.replace(/-$/, '');
  return key;
}

function parseSynthesis(line) {
  let part = line.split('->');
  let synthesis = [];
  for (let i in part) {
    synthesis[i] = part[i].trim().split(' ').sort();
  }
  return synthesis;
}

function generateHTML(breakdown){
  let html = '';
  for (let k in breakdown) {
    html += k;
    let number = breakdown[k];
    if(number > 1){
      html += '<sub>'+number+'</sub>';
    }
  }
  return html;
}
