const acorn = require('acorn');

const Parser = (targetCode) => {
    const cleanCode = targetCode.replace(/^#!.*/, '');
    return acorn.parse(cleanCode, { ecmaVersion: 2020 });
};

module.exports = {
    Parser,
};