const walk = require('acorn-walk');

const extractApiRoutes = (ASTree) => {
    const apiList = [];

    walk.simple(ASTree, {
        CallExpression(node) {
            if (node.callee.type === 'MemberExpression') {
                const objectName = node.callee.object.name;
                const propertyName = node.callee.property.name;
                
                if (
                    objectName === 'app' && 
                    ['get', 'post', 'put', 'patch', 'delete'].includes(propertyName)
                ) {
                    if (node.arguments[0] && node.arguments[0].type === 'Literal') {
                        const path = node.arguments[0].value;
                        const method = propertyName.toUpperCase();
                        
                        const inputs = [];
                        const outputs = [];

                        const statements = node.arguments[1].body.body;
                        
                        for (let statement of statements) {
                            if (statement.type === 'VariableDeclaration') {
                                const init = statement.declarations[0].init;
                                
                                if (init && init.type === 'MemberExpression') {
                                    const reqType = init.object.property ? init.object.property.name : 'unknown'; 
                                    const paramName = init.property.name; 
                                    
                                    inputs.push({
                                        location: reqType,
                                        parameter: paramName
                                    });
                                }
                            } 
                            else if (statement.type === 'ExpressionStatement') {
                                const expr = statement.expression;
                                
                                if (expr && expr.type === 'CallExpression' && expr.callee.type === 'MemberExpression') {
                                    const resObj = expr.callee.object.name;
                                    const resMethod = expr.callee.property.name;
                                    
                                    let returnData = '';
                                    if (expr.arguments[0] && expr.arguments[0].type === 'ObjectExpression') {
                                        const prop = expr.arguments[0].properties[0];
                                        if (prop) {
                                            returnData = `{ ${prop.key.name}: ${prop.value.value} }`;
                                        }
                                    } else if (expr.arguments[0] && expr.arguments[0].type === 'Literal') {
                                        returnData = `'${expr.arguments[0].value}'`;
                                    }

                                    outputs.push({
                                        method: `${resMethod}`,
                                        arguments: returnData
                                    });
                                }
                            }
                        }

                        apiList.push({
                            Method: method,
                            Path: path,
                            Inputs: inputs.length > 0 ? inputs : null,
                            Outputs: outputs.length > 0 ? outputs : null
                        });
                    }
                }
            }
        }
    });

    return apiList;
};

module.exports = {
    extractApiRoutes,
};