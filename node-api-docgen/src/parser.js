const acorn = require('acorn');
const walk = require('acorn-walk');

const Parser = (targetCode) => {
    try {
        const ASTree = acorn.parse(targetCode, {ecmaVersion : 2020});
        const List = [];

        walk.simple(ASTree, {
            CallExpression(node) {
                if (node.callee.type == 'MemberExpression') {
                    const objectName = node.callee.object.name;
                    const propertyName = node.callee.property.name
                    
                    if (objectName == "app" && 
                        ["get", "post", "put", "patch", "delete"].includes(propertyName)
                    ) {
                        if (node.arguments[0] && node.arguments[0].type === 'Literal') {
                            const path = node.arguments[0].value;

                            List.push({
                                Method: propertyName.toUpperCase(),
                                Path: path
                            });
                        }
                    }
                }
            }
        })

        console.table(List);
    } catch (err) {
        console.log("err : ", err.message);
    }
};

module.exports = {
    Parser,
}