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
                        
                        apiList.push({
                            Method: propertyName.toUpperCase(),
                            Path: path
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