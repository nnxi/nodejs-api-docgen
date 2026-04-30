import * as acorn from 'acorn';

export const Parser = (targetCode) => {
    const comments = [];

    // Remove shebang to prevent parsing errors
    const cleanCode = targetCode.replace(/^#!.*/, '');

    const ast = acorn.parse(cleanCode, { 
        ecmaVersion: 'latest', 
        sourceType: 'module',  
        locations: true, 
        onComment: comments
    });

    return { ast, comments };
};