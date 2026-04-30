import fs from 'fs';
import path from 'path';
import walk from 'acorn-walk';
import { Parser } from '../src/parser.js';

export const extractApiRoutes = (parentsPath, ASTree, comments, parentsUrl = '', visitedFiles, isStrict) => {
    const apiList = [];
    
    // Map to store router variables and their required/imported paths
    const routerMap = new Map();  

    walk.simple(ASTree, {
        // Parse ESM Import declarations (e.g., import router from './router.js')
        ImportDeclaration(node) {
            const importPath = node.source.value;
            node.specifiers.forEach(specifier => {
                // Handle both default and named imports
                if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier') {
                    const localName = specifier.local.name;
                    routerMap.set(localName, importPath);
                }
            });
        },
        VariableDeclaration(node) {  
            const declarator = node.declarations[0];
            
            if (declarator && declarator.init && declarator.init.type === 'CallExpression') {
                const callee = declarator.init.callee;
                
                // Find 'require' statements to track sub-router files
                if (callee.type === 'Identifier' && callee.name === 'require') {
                    const routerVarName = declarator.id.name;
                    const requirePath = declarator.init.arguments[0].value;
                    
                    routerMap.set(routerVarName, requirePath);
                }
            }
        },
        CallExpression(node) {
            if (node.callee.type === 'MemberExpression') {
                // Check if object exists to prevent errors on anonymous function calls
                const objectName = node.callee.object?.name;
                const propertyName = node.callee.property.name;

                // Case of mounting a sub-router (e.g., app.use('/api', apiRouter))
                if ((objectName === 'app' || objectName === 'router') && propertyName === 'use') {
                    const args = node.arguments;

                    if (args.length >= 2 && args[0].type === 'Literal' && args[1].type === 'Identifier') {
                        const basePath = args[0].value;
                        const routerVarName = args[1].name;

                        // If the argument is a known router, parse that router file recursively
                        if (routerMap.has(routerVarName)) {
                            let routePath = routerMap.get(routerVarName);

                            // Append .js extension for ESM compatibility if missing
                            if (!routePath.endsWith('.js')) {
                                routePath += '.js';
                            }

                            // Calculate the absolute path based on the current file's directory
                            const baseDir = path.dirname(path.resolve(parentsPath));
                            const absolutePath = path.resolve(baseDir, routePath);

                            // Prevent infinite loops from circular dependencies and handle missing files
                            if (visitedFiles.has(absolutePath) || !fs.existsSync(absolutePath)) {
                                return;
                            }
                            visitedFiles.add(absolutePath);

                            const targetCode = fs.readFileSync(absolutePath, 'utf-8');
                            const { ast, comments: comm } = Parser(targetCode);

                            // Recursively extract routes from the sub-router with accumulated base path
                            const childRoutes = extractApiRoutes(absolutePath, ast, comm, parentsUrl + basePath, visitedFiles, isStrict);
                            
                            apiList.push(...childRoutes);
                        }
                    }
                }
                // Case of defining an API endpoint (e.g., app.get('/users', ...))
                else if (
                    (objectName === 'app' || objectName === 'router') && 
                    ['get', 'post', 'put', 'patch', 'delete'].includes(propertyName)
                ) {
                    if (node.arguments[0] && node.arguments[0].type === 'Literal') {
                        const currentPath = node.arguments[0].value;
                        const method = propertyName.toUpperCase();
                        
                        const routeStartLine = node.loc.start.line;

                        // Find the block comment located immediately above this route definition
                        const targetComment = comments.find(c => 
                            c.type === 'Block' && 
                            c.loc.end.line <= routeStartLine && 
                            routeStartLine - c.loc.end.line <= 2 
                        );

                        let hasDocgenTag = false;
                        let tag = 'Uncategorized';
                        let summary = '';
                        const parsedReq = [];  // @req and @res tags can be used multiple times
                        const parsedRes = [];

                        if (targetComment) {
                            const lines = targetComment.value.split('\n');

                            // Parse custom tags from the comment block
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

                        // Skip this route if --strict mode is on and @api-docgen is missing
                        if (isStrict && !hasDocgenTag) {
                            return; 
                        }
                        
                        apiList.push({
                            Tag: tag,
                            Summary: summary,
                            Method: method,
                            // Prevent duplicate slashes in the final path
                            Path: (parentsUrl + currentPath).replace(/\/+/g, '/'),
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