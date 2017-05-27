#!/usr/bin/env node

var DOMParser = require('xmldom').DOMParser;
var cheerio = require('cheerio');
var watchr = require('watchr');
var path = require('path');
var fs = require('fs');

var processFile = function (filePath) {

  var parsedPath = path.parse(filePath);
  var source = fs.readFileSync(filePath, 'utf-8');
  var $ = cheerio.load(source, {
    decodeEntities: false,
    xmlMode: false,
  });

  if (!$) {
    return
  }

  var templates = $('<div>').append($('template'));
  var script = $('script');
  var style = $('style');
  
  var templateContent = templates.html();
  var templatePath = path.join(parsedPath.dir, parsedPath.name + '.html');

  var scriptContent = script.html();
  var scriptPath = path.join(parsedPath.dir, parsedPath.name + '.js');

  var styleContent = style.html();
  var stylePath = path.join(parsedPath.dir, parsedPath.name + '.less');
  
  if (templateContent)  fs.writeFileSync(templatePath, templateContent.replace('}}=""', '}}'));
  if (scriptContent)    fs.writeFileSync(scriptPath, scriptContent);
  if (styleContent)     fs.writeFileSync(stylePath, styleContent);

}

if (process.argv[2] === '--file') {
  console.log('processing file', process.argv[3])
  processFile(process.argv[3])
} else {
  console.log('watching', process.argv[3]);
  function listener(changeType, fullPath, currentStat, previousStat) {
    if (path.parse(fullPath).ext !== '.ui') {
      return
    }
    if (changeType !== 'delete') {
      console.log('processing file', fullPath)
      processFile(fullPath)
    }
  }

  function next(err) {
    if (err)  return console.log('watch failed on', path, 'with error', err)
  }

  var stalker = watchr.open(process.argv[3], listener, next)

  //stalker.close()
}