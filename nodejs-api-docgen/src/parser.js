const acorn = require('acorn');

const Parser = (targetCode) => {
    const comments = [];

    const cleanCode = targetCode.replace(/^#!.*/, '');

    const ast = acorn.parse(cleanCode, { 
        ecmaVersion: 2020,
        locations: true,
        onComment: comments
    });

    return { ast, comments };
};

module.exports = {
    Parser,
};