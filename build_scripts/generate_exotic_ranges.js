/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');

let ranges = [];

let top = 1e6;
let magnitude = 1;
let maxValue = 10;

let range = {};
range.top = top;
range.range = top;
range.max_value = 0;
range.midpoint = top/2;
let prev = top;
top *= Math.pow(10, magnitude);
magnitude++;
ranges.push(range);
while(top < Infinity){
  range = {};
  range.top = top;
  range.range = top-prev;
  range.max_value = maxValue;
  range.midpoint = range.range/2+prev;
  prev = top;
  maxValue *= 10;
  top *= Math.pow(10, magnitude);
  magnitude++;
  ranges.push(range);
}

jsonfile.writeFileSync('build/data/exotic_ranges.json', ranges, {
  spaces: 2
});
