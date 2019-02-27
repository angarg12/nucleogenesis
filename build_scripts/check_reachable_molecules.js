/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let fs = require('fs');

let elements = jsonfile.readFileSync('build/data/elements.json');

let resources = new Set();
for (let element in elements) {
  resources.add(element);
}

let reactions = [];
fs.readFileSync('build/data/raw_reactions.txt').toString().split('\n').forEach(function(line, index, arr) {
  let first = line.split('->')[0].trim();
  let second = line.split('->')[1].trim();
  let reactant = first.split(' ');
  let product = second.split(' ');
  reactions.push({reactant: reactant, product: product});
});

let leftovers = [];
while(true){
  leftovers = [];
  for(let reaction of reactions){
    let reacted = true;
    for(let reactant of reaction.reactant){
      if(!resources.has(reactant)){
        leftovers.push(reaction);
        reacted = false;
        break;
      }
    }
    if(reacted){
      for(let product of reaction.product){
        resources.add(product);
      }
    }
  }
  if(leftovers.length === reactions.length) break;
  reactions = leftovers;
}

if(leftovers.length > 0) {
  let message = 'There are unreachable reactions.\n';
  leftovers.forEach((reaction) => {
    message += reaction.reactant.join(' ') + ' -> ' + reaction.product.join(' ') + '\n';
  });
  throw new Error(message);
}