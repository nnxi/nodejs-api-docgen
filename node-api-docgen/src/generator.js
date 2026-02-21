const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const generateDocs = (apiList) => {
    try {
        const tableRows = apiList.map(api => {
            const inputsHtml = api.Inputs ? JSON.stringify(api.Inputs, null, 2) : 'None';
            const outputsHtml = api.Outputs ? JSON.stringify(api.Outputs, null, 2) : 'None';

            return `
                <tr>
                    <td><span class="method ${api.Method.toLowerCase()}">${api.Method}</span></td>
                    <td><code>${api.Path}</code></td>
                    <td><pre>${inputsHtml}</pre></td>
                    <td><pre>${outputsHtml}</pre></td>
                </tr>
            `;
        }).join('');

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Documentation</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; background: #f4f7f6; color: #333; }
                h1 { text-align: center; color: #2c3e50; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
                th, td { padding: 16px; text-align: left; border-bottom: 1px solid #eee; vertical-align: top; }
                th { background: #2c3e50; color: white; font-weight: 500; }
                tr:hover { background-color: #f8f9fa; }
                .method { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.9em; color: white; display: inline-block; width: 60px; text-align: center; }
                .get { background: #3498db; }
                .post { background: #2ecc71; }
                .put { background: #f1c40f; }
                .delete { background: #e74c3c; }
                pre { background: #2d2d2d; color: #ccc; padding: 10px; border-radius: 4px; font-size: 0.85em; margin: 0; white-space: pre-wrap; word-wrap: break-word; }
                code { font-size: 1.1em; font-weight: bold; color: #e83e8c; }
            </style>
        </head>
        <body>
            <h1>API Documentation</h1>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>Inputs (Request)</th>
                        <th>Outputs (Response)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
        `;

        const filePath = path.join(process.cwd(), 'api-docs.html');
        fs.writeFileSync(filePath, htmlTemplate, 'utf-8');

        let command = '';
        if (process.platform === 'win32') command = `start "" "${filePath}"`; // window
        else if (process.platform === 'darwin') command = `open "${filePath}"`; // mac
        else command = `xdg-open "${filePath}"`; // linux

        exec(command, (error) => {
            if (error) console.log('Error:', error.message);
        });

    } catch (err) {
        console.log('Error: ', err.message);
    }
};

module.exports = {
    generateDocs,
};