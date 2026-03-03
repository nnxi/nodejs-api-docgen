#!/usr/bin/env node

const fs = require('fs');
const path = require('path')
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
                  (default: app.js)

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
    const startTargetPath = userInput.find(arg => !arg.startsWith('-')) || 'app.js';
    
    const absoluteRootPath = path.resolve(process.cwd(), startTargetPath);

    if (!fs.existsSync(absoluteRootPath)) {
        console.log(`Error: Entry file '${startTargetPath}' not found.`);
        process.exit(1);
    }

    const visitedFiles = new Set();
    visitedFiles.add(absoluteRootPath);

    try {
        const targetCode = fs.readFileSync(absoluteRootPath, 'utf-8');

        if (isStrict && !targetCode.includes('//@api-docgen')) {
            console.log('Strict mode enabled: Target file does not have //@api-docgen tag.');
            process.exit(0);
        }

        const ast = Parser(targetCode);
        
        const extractedData = extractApiRoutes(ast, '', visitedFiles, isStrict); 

        generateDocs(extractedData);
        
        console.log('Documentation generated successfully');

    } catch (err) {
        console.log('Error: ', err.message);
    }
} catch (err) {
    console.log('Error: ', err.message);
}