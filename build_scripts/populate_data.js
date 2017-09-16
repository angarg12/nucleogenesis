/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const fs = require('fs');

let dataFile = fs.readFileSync('build/scripts/data.js').toString();
let files = fs.readdirSync('build/data');

let data = '{';

for(let i in files){
  let file = files[i];
  if(file.endsWith('.json')){
    let content = jsonfile.readFileSync('build/data/'+file);
    data += '\''+file.replace('.json','') + '\':'+ JSON.stringify(content)+',';
  }
}
// read the version from the npm config
let npm = jsonfile.readFileSync('package.json');

data += '\'version\':\''+npm.version+'\'';

data += '}';

let dataTemplate = template(dataFile);

fs.writeFileSync('build/scripts/data.js', dataTemplate({'data': data}));
