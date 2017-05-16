/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let path = require('path');
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

let chosen = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];
let ln = 1;
let has_errors = false;
let syntheses = {};
// for each reaction
lineReader.on('line', function (line) {
  let synthesis = parseSynthesis(line);
  if (!isValidSynthesis(synthesis)) {
    console.log(ln + ' ' + line);
    has_errors = true;
  }

  let key = generateKey(synthesis);
  syntheses[key] = {};
  syntheses[key].reactant = vectorToMap(synthesis[0]);
  syntheses[key].product = vectorToMap(synthesis[1]);
  extractElements(syntheses[key], key);

  ln++;
});

lineReader.on('close', function () {
  findDeadEnds(syntheses);
  if (has_errors) {
    throw new Error('Failed to generate syntheses');
  }

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

// we want to make sure that all molecules can be made
// i.e. all molecules in the left of a syntheses, must appear in the right
// (except single atoms)
function findDeadEnds(syntheses) {
  let ln = 1;
  for (let i in syntheses) {
    let reactant = syntheses[i].reactant;
    // for each molecule
    for (let molecule in reactant) {
      let found = false;
      for (let j in syntheses) {
        // skip the own synthesis
        if (i == j) {
          continue;
        }
        if (syntheses[j].product[molecule] !== -1 || elements[molecule] !== undefined) {
          found = true;
          break;
        }
      }
      if (found === false) {
        console.log('Error: molecule is a dead end: ' + ln + ' ' + molecule + ' ' + i);
        has_errors = true;
      }
    }
    ln++;
  }
}

function extractElements(synthesis, key) {
  synthesis.elements = [];
  elementsFromHalf(synthesis.reactant, synthesis.elements, key);
  elementsFromHalf(synthesis.product, synthesis.elements, key);
}

function elementsFromHalf(half, synth_elements, key){
  for (let i in half) {
    let breakdown = parser.decomposeFormula(i);
    for (let j in breakdown) {
      if (elements[j].includes.indexOf(i) === -1) {
        elements[j].includes.push(i);
      }
      // we add the elements involved in both parts
      if (synth_elements.indexOf(j) === -1) {
        synth_elements.push(j);
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

function isUnbalancedSynthesis(synthesis) {
  let reactant = parser.decomposeFormula(synthesis[0].join(''));
  let product = parser.decomposeFormula(synthesis[1].join(''));
  for (let i in reactant) {
    if (reactant[i] != product[i]) {
      return true;
    }
  }
  return false;
}

function isRepeatedSynthesis(synthesis) {
  if (synthesis[0].length != synthesis[1].length) {
    return false;
  }
  for (let i in synthesis[0]) {
    if (synthesis[0][i] != synthesis[1][i]) {
      return false;
    }
  }
  return true;
}

function parseSynthesis(line) {
  let part = line.split('->');
  let synthesis = [];
  for (let i in part) {
    synthesis[i] = part[i].trim().split(' ').sort();
  }
  return synthesis;
}

function isValidSynthesis(synthesis) {
  if (synthesis.length != 2 ||
    synthesis[0][0].length === 0 ||
    synthesis[1][0].length === 0) {
    console.log('Error: malformed synthesis');
    return false;
  }
  for (let i in synthesis) {
    if (!isValidHalf(synthesis[i])) {
      return false;
    }
  }
  if (isRepeatedSynthesis(synthesis)) {
    console.log('Error: synthesis is repeated');
    return false;
  }
  if (isUnbalancedSynthesis(synthesis)) {
    console.log('Error: synthesis is unbalanced');
    return false;
  }
  return true;
}

function isValidHalf(molecules) {
  for (let j in molecules) {
    if (!isValidMolecule(molecules[j])) {
      return false;
    }
  }
  return true;
}

function isValidMolecule(molecule) {
  try {
    let breakdown = parser.decomposeFormula(molecule);
    if (Object.keys(breakdown).length > 2) {
      console.log('Error: molecule too large');
      return false;
    }
    // FIXME only for the beta
    for (let k in breakdown) {
      if (chosen.indexOf(k) === -1) {
        console.log('Error: molecule contains invalid elements');
        return false;
      }
    }
    if (!resources[molecule] && !elements[molecule]) {
      resources[molecule] = {};
      resources[molecule].elements = breakdown;
      resources[molecule].html = generateHTML(breakdown);
      resources[molecule].type = ['molecule'];
    }
  } catch (e) {
    console.log('Error: unable to parse molecule');
    return false;
  }
  return true;
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
