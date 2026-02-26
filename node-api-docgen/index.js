#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Parser } = require('./src/parser');
const { extractApiRoutes } = require('./src/extractor');
const { generateDocs } = require('./src/generator');
const { fileScanner } = require('./src/scanner');

try {
    const userInput = process.argv[2];

    if (userInput === '--help' || userInput === '-h') {
        console.log(`
Usage: api-docgen [options] [arguments]

Arguments:
  [filename]      Generates API documentation based on routes in the specified file.
                  (default: app.js)

Options:
  -h, --help      Print api-docgen command line options.
        `)
        process.exit(0);
    }

    console.log('api docgen is running');

    const isStrict = process.argv[3].includes('--strict');

    let fileList = [];
    const extractedData = [];

    fileList = fileScanner(userInput, fileList, isStrict);

    for (const filePath of fileList) {

        const targetCode = fs.readFileSync(filePath, 'utf-8');

        const ast = Parser(targetCode);
        
        extractedData.push(extractApiRoutes(ast));
    }

    generateDocs(extractedData);

} catch (err) {
    console.log('Error: ', err.message);
}