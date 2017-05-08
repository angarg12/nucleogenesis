/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const fs = require('fs');

const args = process.argv.slice(2);

var data_file = fs.readFileSync(args[0]+'/scripts/data.js').toString();
var files = fs.readdirSync(args[0]+'/data');

var data = "{";

for(var i in files){
  var file = files[i];
  if(file.endsWith('.json')){
    var content = jsonfile.readFileSync(args[0]+'/data/'+file);
    data += "\""+file.replace('.json','') + "\":"+ JSON.stringify(content)+",";
  }
}
// read the version from the npm config
var npm = jsonfile.readFileSync('package.json');

data += "\"version:\":\""+npm.version+"\"";

data += "}";

var data_template = template(data_file);

fs.writeFileSync(args[0]+'/scripts/data.js', data_template({'data': data}));
