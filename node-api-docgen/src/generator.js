const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const generateDocs = (apiList) => {
    try {
        const flatedList = apiList.flat();

        if (flatedList.length === 0) {
            console.log('No API routes were found in the specified directory.');
            return;
        }

        const tableRows = flatedList.map(api => {
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
                :root {
                    --bg-color: #f8f9fa;
                    --text-main: #2d3748;
                    --text-muted: #718096;
                    --border-color: #e2e8f0;
                    --header-bg: #ffffff;
                    --code-bg: #1e1e1e;
                }
                
                * { box-sizing: border-box; margin: 0; padding: 0; }
                
                body { 
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                    background-color: var(--bg-color); 
                    color: var(--text-main); 
                    line-height: 1.6;
                }

                header {
                    background-color: var(--header-bg);
                    border-bottom: 1px solid var(--border-color);
                    padding: 16px 40px;
                    display: flex;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                .brand {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #2b6cb0;
                    letter-spacing: -0.5px;
                }

                /* 메인 컨테이너 */
                main {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 0 20px;
                }

                h1 { 
                    font-size: 1.8rem;
                    margin-bottom: 8px;
                    color: var(--text-main);
                }

                .subtitle {
                    color: var(--text-muted);
                    margin-bottom: 30px;
                    font-size: 0.95rem;
                }

                .table-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
                    overflow-x: auto;
                }

                table { 
                    width: 100%; 
                    border-collapse: separate; 
                    border-spacing: 0;
                }

                th, td { 
                    padding: 18px 24px; 
                    text-align: left; 
                    border-bottom: 1px solid var(--border-color); 
                    vertical-align: top; 
                }

                th { 
                    background-color: #f7fafc; 
                    color: #4a5568; 
                    font-weight: 600; 
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                tr:last-child td {
                    border-bottom: none;
                }

                tr:hover td { 
                    background-color: #fbfbfc; 
                }

                .method { 
                    padding: 6px 12px; 
                    border-radius: 6px; 
                    font-weight: 700; 
                    font-size: 0.85rem; 
                    color: white; 
                    display: inline-block; 
                    width: 75px; 
                    text-align: center; 
                    letter-spacing: 0.5px;
                }
                .get { background: #3182ce; }
                .post { background: #38a169; }
                .put { background: #d69e2e; }
                .patch { background: #805ad5; }
                .delete { background: #e53e3e; }

                code { 
                    font-size: 0.95rem; 
                    font-weight: 600; 
                    color: #e53e3e; 
                    background: #fff5f5;
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                pre { 
                    background: var(--code-bg); 
                    color: #e2e8f0; 
                    padding: 16px; 
                    border-radius: 8px; 
                    font-size: 0.85rem; 
                    margin: 0; 
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                    font-family: 'Fira Code', Consolas, Monaco, monospace;
                }
            </style>
        </head>
        <body>
            <header>
                <div class="brand">api-docgen</div>
            </header>
            
            <main>
                <h1>API Routes Reference</h1>
                <p class="subtitle">Automatically generated documentation for your backend API services.</p>
                
                <div class="table-container">
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
                </div>
            </main>
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