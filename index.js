'use strict'

const plist = require("plist");
const CSON = require("season");
const fs = require("fs");
const https = require('https');
var path = require('path');

const atomGrammarUrl = 'https://raw.githubusercontent.com/asciidoctor/atom-language-asciidoc/master/grammars/language-asciidoc.cson';
const filepath = path.resolve(__dirname, 'language-asciidoc.cson');
const vscodeSyntaxeFilePath = path.resolve(__dirname, 'asciidoc.tmLanguage');

// ESSAI 01
// let file = fs.createWriteStream(filepath);
// https.get(atomGrammarUrl, (response) => {
//   response.pipe(file);
// })
//
// let grammarCson = CSON.readFileSync(filepath);
// let syntaxes = plist.build(grammarCson);
//
// fs.writeFileSync(vscodeSyntaxeFilePath, syntaxes);
//

// ESSAI 02
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

download(atomGrammarUrl, filepath)
  .then((file) => CSON.readFileSync(file))
  .then((grammar) => plist.build(grammar))
  .then((syntaxe) => fs.writeFileSync(vscodeSyntaxeFilePath, syntaxe));
