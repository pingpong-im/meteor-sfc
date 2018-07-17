#!/usr/bin/env node

var DOMParser = require('xmldom').DOMParser
var cheerio = require('cheerio')
var watchr = require('watchr')
var path = require('path')
var fs = require('fs')


var fileExists = (path) => {
	try {
		fs.accessSync(path, fs.constants.R_OK);
		return true
	} catch (err) {
		return false
	}
}

var toComponentName = (str) => {
	return str.split('-').map(function (word) {
		return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
	}).join('')
}

var getFullComponentName = (filePath) => {


	let isSfcRootFound = false
	let without = []
	let crumbs = path.dirname(filePath).split('/').reverse()
	let baseName = path.dirname(filePath)
	let keep = []

	crumbs.forEach((item) => {
		let sfcRootPath = baseName.replace(keep.join('/'), '') + '.sfcroot'

		if (!fileExists(sfcRootPath)) {
			keep.unshift(item)
		}

	})


	return keep.join('-')
}

var processFile = function (filePath) {
	var dirName = path.dirname(filePath)
	var baseName = path.basename(filePath, '.sfc')
	var parsedPath = path.parse(filePath)
	var source = fs.readFileSync(filePath, 'utf-8')

	if (source.trim() === '' || true == false) {
		var componentName = toComponentName(path.basename(getFullComponentName(filePath)))
		var template = `<template name="${componentName}">
	<div class="${getFullComponentName(filePath)}">
			${componentName}
	</div>
</template>

`

		var script = `<script>

	Template.${componentName}.onCreated(function () {
		
	})
	
	Template.${componentName}.onRendered(function () {
		
	})
	
	Template.${componentName}.helpers({
		//helpers
	})
	
	Template.${componentName}.events({
		//events
	})

</script>

`

		var style = `<style type="text/less">
	.${getFullComponentName(filePath)} {
	
	}
</style>
`
		console.log('template file', dirName + '/' + baseName + '.html')
		console.log('script file', dirName + '/' + baseName + '.js')
		console.log('style file', dirName + '/' + baseName + '.less')

		if (fileExists(dirName + '/' + baseName + '.html')) {
			template = fs.readFileSync(dirName + '/' + baseName + '.html', {encoding: 'utf8'})
		}


		if (fileExists(dirName + '/' + baseName + '.js')) {
			script = `

<script>
	${fs.readFileSync(dirName + '/' + baseName + '.js', {encoding: 'utf8'})}
</script>`
		}

		if (fileExists(dirName + '/' + baseName + '.less')) {
			style = `

<style type="text/less">
	${fs.readFileSync(dirName + '/' + baseName + '.less', {encoding: 'utf8'})}
</style>`
		}

		source = template + script + style
		fs.writeFileSync(filePath, source)
	}

	var $ = cheerio.load(source, {
		decodeEntities: false,
		xmlMode: false
	});

	if (!$) {
		return
	}

	var templates = $('<div>').append($('template'))
	var script = $('script')
	var style = $('style')

	var templateContent = templates.html()
	var templatePath = path.join(parsedPath.dir, parsedPath.name + '.sfc.html')

	var scriptContent = script.html();
	var scriptPath = path.join(parsedPath.dir, parsedPath.name + '.sfc.js')

	var styleContent = style.html();
	var stylePath = path.join(parsedPath.dir, parsedPath.name + '.sfc.less')

	if (templateContent) fs.writeFileSync(templatePath, templateContent.replace('}}=""', '}}'))
	if (scriptContent) fs.writeFileSync(scriptPath, scriptContent)
	if (styleContent) fs.writeFileSync(stylePath, styleContent)

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
		if (err) return console.log('watch failed on', path, 'with error', err)
	}

	var stalker = watchr.open(process.argv[3], listener, next)

	//stalker.close()
}