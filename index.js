'use strict'

const plist = require("plist");
const CSON = require("season");
const fs = require("fs");
const https = require('https');
var path = require('path');

const atomGrammarUrl = 'https://raw.githubusercontent.com/asciidoctor/atom-language-asciidoc/master/grammars/language-asciidoc.cson';
const filepath = path.resolve(__dirname, 'language-asciidoc.cson');
const vscodeSyntaxeFileName = path.resolve(__dirname, 'asciidoc');

// TODO remplace `\p` automatically

// Download and store file
let download = (url, outputPath) => {
  let fileStream = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    https.get(atomGrammarUrl, (response) => {
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => resolve(outputPath));
      });
    })
  });
};

// to plist
download(atomGrammarUrl, filepath)
  .then((file) => CSON.readFileSync(file))
  .then((grammar) => plist.build(grammar))
  .then((syntaxe) => fs.writeFileSync(vscodeSyntaxeFileName + ".tmLanguage", syntaxe));

// to json
download(atomGrammarUrl, filepath)
  .then((file) => CSON.readFileSync(file))
  .then((grammar) => JSON.stringify(grammar, undefined, 2))
  .then((json) => fs.writeFileSync(vscodeSyntaxeFileName + ".json", json));
