# meteor-sfc

This package implements single file component for meteor.js

Regular meteor approach is to put html, less and js into different files.

But having all in single file component is more visual. 

Inspired by https://vuejs.org/v2/guide/single-file-components.html

## Installation
 
 npm i -g meteor-sfc

## Usage

Put all code into file with .ui extension 

example.ui
~~~~
<template name="hacker">
  <div class="hacker">
    <h1 class="hacker_name">{{name}}</h1>
  </div>
</template>

<script>
  Template.hacker.helpers({
    name () {
      return 'Neo'
    }
  })
</script>

<style lang="less">
  .hacker_name {
    color: yellow;
    background-color: #333;
  }
</style>
~~~~

meteor-sfc will parse **example.ui** and create at the same level:

**example.html** with handlebars templates <br>
**example.less** with styles <br>
**example.js** with scripts 


### Parse single file

meteor-sfc --file ./components/example.ui

note: you can add meteor-sfc as a filewatcher to webstorm IDE

### Watch directory 

meteor-sfc --dir ./components