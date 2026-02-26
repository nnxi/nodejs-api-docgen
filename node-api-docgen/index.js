#!/usr/bin/env node

const fs = require('fs');
const packageJson = require('./package.json');
const { Parser } = require('./src/parser');
const { extractApiRoutes } = require('./src/extractor');
const { generateDocs } = require('./src/generator');
const { fileScanner } = require('./src/scanner');

try {
    const userInput = process.argv.slice(2);

    if (userInput.length === 0) {
        console.log(`
Welcome to node-api-docgen

Run 'api-docgen --help' for usage instructions.
        `);
        process.exit(0);
    }

    if (userInput.includes('--help') || userInput.includes('-h')) {
        console.log(`
Usage: api-docgen [options] [arguments]

Arguments:
  [path]          Generates API documentation based on routes in the specified file or directory.
                  (default: .)

Options:
  -h, --help      Print api-docgen command line options.
  -v, --version   Print current version of node-api-docgen.
  --strict        Only parse files that include the // @api-docgen comment.
        `)
        process.exit(0);
    }
    else if (userInput.includes('--version') || userInput.includes('-v')) {
        console.log(`
node-api-docgen
version : ${packageJson.version}
        `);
        process.exit(0);
    }

    console.log('api docgen is running');

    const isStrict = userInput.includes('--strict');

    let fileList = [];
    const extractedData = [];

    const startTargetPath = userInput.find(arg => !arg.startsWith('-')) || '.';

    fileList = fileScanner(startTargetPath, fileList, isStrict);

    for (const filePath of fileList) {

        const targetCode = fs.readFileSync(filePath, 'utf-8');

        const ast = Parser(targetCode);
        
        extractedData.push(extractApiRoutes(ast));
    }

    generateDocs(extractedData);

} catch (err) {
    console.log('Error: ', err.message);
}