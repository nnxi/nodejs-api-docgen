const fs = require('fs');
const path = require('path');
const walk = require('acorn-walk');
const { Parser } = require('../src/parser');

const extractApiRoutes = (parentsPath, ASTree, comments, parentsUrl = '', visitedFiles, isStrict) => {
    const apiList = [];
    const routerMap = new Map();

    walk.simple(ASTree, {
        VariableDeclaration(node) {
            const declarator = node.declarations[0];
            
            if (declarator.init && declarator.init.type === 'CallExpression') {
                const callee = declarator.init.callee;
                
                if (callee.type === 'Identifier' && callee.name === 'require') {
                    const routerVarName = declarator.id.name;
                    const requirePath = declarator.init.arguments[0].value;
                    
                    routerMap.set(routerVarName, requirePath);
                }
            }
        },
        CallExpression(node) {
            if (node.callee.type === 'MemberExpression') {
                const objectName = node.callee.object.name;
                const propertyName = node.callee.property.name;

                if ((objectName === 'app' || objectName === 'router') && propertyName === 'use') {
                    const args = node.arguments;

                    if (args.length >= 2 && args[0].type === 'Literal' && args[1].type === 'Identifier') {
                        const basePath = args[0].value;
                        const routerVarName = args[1].name;

                        if (routerMap.has(routerVarName)) {
                            let routePath = routerMap.get(routerVarName);

                            if (!routePath.endsWith('.js')) {
                                routePath += '.js';
                            }

                            const baseDir = path.dirname(path.resolve(parentsPath));

                            const absolutePath = path.resolve(baseDir, routePath);

                            if (visitedFiles.has(absolutePath)) {
                                return;
                            }
                            visitedFiles.add(absolutePath);

                            const targetCode = fs.readFileSync(absolutePath, 'utf-8');
                            
                            const { ast, comments: comm } = Parser(targetCode);

                            const childRoutes = extractApiRoutes(absolutePath, ast, comm, basePath, visitedFiles, isStrict);
                            
                            apiList.push(...childRoutes);
                        }
                    }
                }
                else if (
                    (objectName === 'app' || objectName === 'router') && 
                    ['get', 'post', 'put', 'patch', 'delete'].includes(propertyName)
                ) {
                    if (node.arguments[0] && node.arguments[0].type === 'Literal') {
                        const currentPath = node.arguments[0].value;
                        const method = propertyName.toUpperCase();
                        
                        const routeStartLine = node.loc.start.line;

                        const targetComment = comments.find(c => 
                            c.type === 'Block' && 
                            c.loc.end.line <= routeStartLine && 
                            routeStartLine - c.loc.end.line <= 2 
                        );

                        let hasDocgenTag = false;
                        let tag = 'Uncategorized';
                        let summary = '';
                        const parsedReq = [];
                        const parsedRes = [];

                        if (targetComment) {
                            const lines = targetComment.value.split('\n');

                            for (let line of lines) {
                                const text = line.replace(/^\s*\**\s*/, '').trim();

                                if (text.startsWith('@api-docgen')) {
                                    hasDocgenTag = true;
                                } else if (text.startsWith('@tag')) {
                                    tag = text.replace('@tag', '').trim();
                                } else if (text.startsWith('@summary')) {
                                    summary = text.replace('@summary', '').trim();
                                } else if (text.startsWith('@req')) {
                                    parsedReq.push(text.replace('@req', '').trim());
                                } else if (text.startsWith('@res')) {
                                    parsedRes.push(text.replace('@res', '').trim());
                                }
                            }
                        }

                        if (isStrict && !hasDocgenTag) {
                            return; 
                        }
                        
                        apiList.push({
                            Tag: tag,
                            Summary: summary,
                            Method: method,
                            Path: parentsUrl + currentPath,
                            Req: parsedReq.length > 0 ? parsedReq : null,
                            Res: parsedRes.length > 0 ? parsedRes : null
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