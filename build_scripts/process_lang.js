/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const fs = require('fs');

let langFile = fs.readFileSync('build/scripts/config/lang.js').toString();
let files = fs.readdirSync('build/lang');

const LANG_TEMPLATE = `$translateProvider.translations('<%= lang %>', <%= content %>);`;

let langTemplate = template(LANG_TEMPLATE);

let languages = [];

for(let i in files){
  let file = files[i];
  let content = jsonfile.readFileSync('build/lang/'+file);
  languages.push(langTemplate({ 'lang': file.replace('.json',''), 'content': JSON.stringify(content) }));
}

let langFileTemplate = template(langFile);

fs.writeFileSync('build/scripts/config/lang.js', langFileTemplate({'language':languages.join('\n')}));
