#!/usr/bin/env node

const fs = require('fs');
const path = require('path')
const packageJson = require('./package.json');
const { Parser } = require('./src/parser');
const { extractApiRoutes } = require('./src/extractor');
const { generateDocs } = require('./src/generator');

try {
    const userInput = process.argv.slice(2);

    if (userInput.length === 0) {
        console.log(`
Welcome to nodejs-api-docgen

Run 'api-docgen --help' for usage instructions.
        `);
        process.exit(0);
    }

    if (userInput.includes('--help') || userInput.includes('-h')) {
        console.log(`
Usage: api-docgen [options] [arguments]

Arguments:
  [path]          Generates API documentation based on routes in the specified file.
                  (default: app.js)

Options:
  -h, --help      Print api-docgen command line options.
  -v, --version   Print current version of nodejs-api-docgen.
  --strict        Only generate documentation for routes explicitly marked 
                  with the @api-docgen JSDoc tag.

Comment Block Format:
  To document a route, place a JSDoc-style comment block directly above it.
  Supported tags: @api-docgen (for --strict mode), @tag, @summary, @req, @res.

  Example:
    /**
     * @api-docgen
     * @tag Users
     * @summary Create a new user
     * @req body { username: string, email: string }
     * @res 201 { success: true, userId: number }
     */
    router.post('/', (req, res) => { ... });

For more detailed guides, visit: https://github.com/nnxi/nodejs-api-docgen
        `)
        process.exit(0);
    }
    else if (userInput.includes('--version') || userInput.includes('-v')) {
        console.log(`
nodejs-api-docgen
version: ${packageJson.version}
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

        const { ast, comments } = Parser(targetCode);
        
        const extractedData = extractApiRoutes(absoluteRootPath, ast, comments, '', visitedFiles, isStrict); 

        generateDocs(extractedData);
    } catch (err) {
        console.log('Error: ', err.message);
    }
} catch (err) {
    console.log('Error: ', err.message);
}