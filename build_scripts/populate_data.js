/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const fs = require('fs');

const args = process.argv.slice(2);

let dataFile = fs.readFileSync(args[0]+'/scripts/data.js').toString();
let files = fs.readdirSync(args[0]+'/data');

let data = '{';

for(let i in files){
  let file = files[i];
  if(file.endsWith('.json')){
    let content = jsonfile.readFileSync(args[0]+'/data/'+file);
    data += '\''+file.replace('.json','') + '\':'+ JSON.stringify(content)+',';
  }
}
// read the version from the npm config
let npm = jsonfile.readFileSync('package.json');

data += '\'version\':\''+npm.version+'\'';

data += '}';

let dataTemplate = template(dataFile);

fs.writeFileSync(args[0]+'/scripts/data.js', dataTemplate({'data': data}));
