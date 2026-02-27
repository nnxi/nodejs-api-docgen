const walk = require('acorn-walk');

const extractApiRoutes = (ASTree) => {
    const apiList = [];

    walk.simple(ASTree, {
        CallExpression(node) {
            if (node.callee.type === 'MemberExpression') {
                const objectName = node.callee.object.name;
                const propertyName = node.callee.property.name;
                
                if (
                    (objectName === 'app' || objectName === 'router') && 
                    ['get', 'post', 'put', 'patch', 'delete'].includes(propertyName)
                ) {
                    if (node.arguments[0] && node.arguments[0].type === 'Literal') {
                        const path = node.arguments[0].value;
                        const method = propertyName.toUpperCase();
                        
                        const inputs = [];
                        const outputs = [];

                        const lastArg = node.arguments[node.arguments.length - 1];

                        const isFunction = lastArg.type === 'ArrowFunctionExpression' || lastArg.type === 'FunctionExpression';

                        const hasBlockBody = lastArg.body?.type === 'BlockStatement';

                        if (!isFunction || !hasBlockBody) {
                            apiList.push({
                                Method: method,
                                Path: path,
                                Inputs: null,
                                Outputs: null
                            });

                            return;
                        }

                        const statements = lastArg.body.body;
                        
                        for (let statement of statements) {
                            if (statement.type === 'VariableDeclaration') {  // inputs from client
                                const id = statement.declarations[0].id;
                                const init = statement.declarations[0].init;

                                if (init && init.type === 'MemberExpression') {
                                    
                                    if (id.type === 'ObjectPattern') {
                                        const reqType = init.property.name;

                                        for (const prop of id.properties) {
                                            inputs.push({
                                                location: reqType,
                                                parameter: prop.key.name
                                            });
                                        }
                                    }
                                    else if (id.type === 'Identifier') {
                                        const reqType = init.object.property ? init.object.property.name : 'unknown';
                                        const paramName = init.property.name;

                                        inputs.push({
                                            location: reqType,
                                            parameter: paramName
                                        });
                                    }
                                }
                            } 
                            else if (statement.type === 'ExpressionStatement') {  // ouputs from server
                                const expr = statement.expression;
                                
                                if (expr && expr.type === 'CallExpression' && expr.callee.type === 'MemberExpression') {
                                    const resObjType = expr.callee.object.type;
                                    const resMethod = expr.callee.property.name;
                                    let resCode = 200;

                                    if (resObjType === 'CallExpression') {
                                        const innerCallee = expr.callee.object.callee;

                                        if (innerCallee && innerCallee.type === 'MemberExpression' && innerCallee.property.name === 'status') {
                                            const argNode = expr.callee.object.arguments[0];

                                            if (argNode && argNode.type === 'Literal') {
                                                resCode = argNode.value;
                                            }
                                        }
                                    }

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
                                        status: resCode || null,
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