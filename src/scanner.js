const fs = require('fs');
const path = require('path');

const exclude = ['node_modules', '.git'];

const fileScanner = (targetPath, fileList = [], isStrict) => {
    try {
        const stat = fs.statSync(targetPath);

        const isDir = stat.isDirectory();

        if (!isDir) {
            if (path.extname(targetPath) == '.js') {
                filePush(targetPath, fileList, isStrict)
                return fileList;
            }

            throw new Error(`Target must be a directory or a .js file: ${targetPath}`);
        }

        const entireFile = fs.readdirSync(targetPath);

        for (const tmp of entireFile) {
            if (exclude.includes(tmp)) {
                continue;
            }

            const tmpFilePath = path.join(targetPath, tmp);

            const tmpStat = fs.statSync(tmpFilePath);

            const tmpIsDir = tmpStat.isDirectory();

            if (tmpIsDir) {
                fileList = fileScanner(tmpFilePath, fileList, isStrict);
            }
            else {
                if (path.extname(tmpFilePath) == '.js') {
                    filePush(tmpFilePath, fileList, isStrict)
                }
            }
        }
        
        return fileList;
        
    } catch (err) {
        console.log('Error: ', err.message);
    }
}



const filePush = (targetPath, fileList, isStrict) => {
    if (isStrict) {
        const fileContext = fs.readFileSync(targetPath, 'utf-8');
        if (fileContext.replace(/ /g, '').includes('//@api-docgen')) {
            fileList.push(targetPath);
        }
    }
    else {
        fileList.push(targetPath);
    }
}

module.exports = {
    fileScanner,
}