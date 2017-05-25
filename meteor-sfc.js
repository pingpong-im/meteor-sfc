#!/usr/bin/env node

var DOMParser = require('xmldom').DOMParser;
var filewatcher = require('filewatcher');
var watchr = require('watchr');
var path = require('path');
var fs = require('fs');

var processFile = function (filePath) {

  var parsed = path.parse(filePath);
  var source = fs.readFileSync(filePath, 'utf-8');
  var doc = new DOMParser().parseFromString(source);
  var templates = doc.getElementsByTagName('template');
  var script = doc.getElementsByTagName('script')[0] + '';
  var style = doc.getElementsByTagName('style')[0] + '';

  var templateContent = '';
  var templatePath = path.join(parsed.dir, parsed.name + '.html');

  var scriptContent = script.replace(/<.*script.*>/gi, '');
  var scriptPath = path.join(parsed.dir, parsed.name + '.js');

  var styleContent = style.replace(/<.*style.*>/gi, '');
  var stylePath = path.join(parsed.dir, parsed.name + '.less');

  for (var i = 0; i < templates.length; i ++) {
    var template = templates[i];
    templateContent += template + '\n';
  }

  fs.writeFileSync(templatePath, templateContent);
  if (scriptContent !== 'undefined') fs.writeFileSync(scriptPath, scriptContent);
  if (styleContent !== 'undefined') fs.writeFileSync(stylePath, styleContent);

}

if (process.argv[2] === '--file') {
  processFile(process.argv[3])
} else {
  console.log('watching', process.argv[3]);
  function listener (changeType, fullPath, currentStat, previousStat) {
    if (path.parse(fullPath).ext !== '.ui') {
      return
    }
    if (changeType !== 'delete') {
      console.log('processing file', fullPath)
      processFile(fullPath)
    }
  }

  function next (err) {
    if ( err )  return console.log('watch failed on', path, 'with error', err)
    //console.log('watch successful on', path)
  }

  var stalker = watchr.open(process.argv[3], listener, next)

 //stalker.close()

}