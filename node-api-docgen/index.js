#!/usr/bin/env node

const fs = require('fs');
const { Parser } = require('./src/parser');
const { extractApiRoutes } = require('./src/extractor');
const { generateDocs } = require('./src/generator');

try {
    console.log('api docgen is running');

    const filePath = './test-app.js';
    const targetCode = fs.readFileSync(filePath, 'utf-8');

    const ast = Parser(targetCode);

    const extractedData = extractApiRoutes(ast);

    generateDocs(extractedData);

} catch (err) {
    console.log('err : ', err.message);
}