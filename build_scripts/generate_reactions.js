/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let parser = require('molecular-parser');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

for (let element in elements) {
  elements[element].reactions = elements[element].reactions || [];
}

let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('build/data/raw_reactions.txt')
});

let reactions = {};
// for each reaction
lineReader.on('line', function (line) {
  let reaction = parseReaction(line);
  let key = generateKey(reaction);
  reactions[key] = {};
  reactions[key].reactant = vectorToMap(reaction[0]);
  reactions[key].product = vectorToMap(reaction[1]);
  extractElements(reactions[key], key);
});

lineReader.on('close', function () {
  jsonfile.writeFileSync('build/data/resources.json', resources, {
    spaces: 2
  });
  jsonfile.writeFileSync('build/data/elements.json', elements, {
    spaces: 2
  });
  jsonfile.writeFileSync('build/data/reactions.json', reactions, {
    spaces: 2
  });
});

function vectorToMap(vector){
  let map = {};
  for(let i in vector){
    let resource = vector[i];
    if(typeof elements[resource] !== 'undefined'){
      resource = elements[resource].main;
    }
    map[resource] = map[resource]+1 || 1;
  }
  return map;
}

function extractElements(reaction, key) {
  reaction.elements = [];
  elementsFromHalf(reaction.reactant, reaction.elements, key);
  elementsFromHalf(reaction.product, reaction.elements, key);
}

function elementsFromHalf(half, reactElements, key){
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
      if (reactElements.indexOf(j) === -1) {
        reactElements.push(j);
      }
      if (elements[j].includes.indexOf(molecule) === -1) {
        elements[j].includes.push(molecule);
      }
      if (elements[j].reactions.indexOf(key) === -1) {
        elements[j].reactions.push(key);
      }
    }
  }
}

function generateKey(reaction) {
  let key = '';
  for (let half in reaction) {
    for (let i in reaction[half]) {
      key += reaction[half][i] + '.';
    }
    key = key.replace(/.$/, '');
    key += '-';
  }
  key = key.replace(/-$/, '');
  return key;
}

function parseReaction(line) {
  let part = line.split('->');
  let reaction = [];
  for (let i in part) {
    reaction[i] = part[i].trim().split(' ').sort();
  }
  return reaction;
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
