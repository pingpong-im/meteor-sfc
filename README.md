# meteor-sfc

This package implements single file component for Meteor

Put all code into file with .ui extension 

example.ui
~~~~
<template name="test">
  <h1>{{name}}</h1>
</template>

<script>
  Template.test.helpers({
    name () {
      return 'Neo'
    }
  })
</script>

<style lang="less">
  h1 {
    color: red;
  }
</style>
~~~~

meteor-sfc will parse and create
 
example.html with handlebars templates
example.less with styles
example.js with scripts 

RUN

meteor-sfc --file example.ui

to process single file. This could be used for like filewatcher for webstorm

or

meteor-sfc --dir .

to watch folder for changes and automatically parse component