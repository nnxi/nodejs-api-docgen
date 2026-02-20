const acorn = require('acorn');

const Parser = (targetCode) => {
    return acorn.parse(targetCode, { ecmaVersion: 2020 });
};

module.exports = {
    Parser,
};