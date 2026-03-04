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

        const groupedList = flatedList.reduce((acc, api) => {
            const tag = api.Tag || 'Uncategorized';
            if (!acc[tag]) acc[tag] = [];
            acc[tag].push(api);
            return acc;
        }, {});

        let contentHtml = '';
        for (const [tag, routes] of Object.entries(groupedList)) {
            const routeCardsHtml = routes.map(api => {
                const reqHtml = api.Req && api.Req.length > 0 ? api.Req.join('\n') : 'None';
                const resHtml = api.Res && api.Res.length > 0 ? api.Res.join('\n') : 'None';

                return `
                    <div class="route-card">
                        <div class="route-header">
                            <span class="method ${api.Method.toLowerCase()}">${api.Method}</span>
                            <code>${api.Path}</code>
                        </div>
                        <div class="route-body">
                            <div class="summary-text">${api.Summary || 'No summary provided.'}</div>
                            
                            <div class="payload-container">
                                <div class="payload-section">
                                    <div class="payload-title">Request</div>
                                    <pre>${reqHtml}</pre>
                                </div>
                                <div class="payload-section">
                                    <div class="payload-title">Response</div>
                                    <pre>${resHtml}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            contentHtml += `
                <details class="tag-group" open>
                    <summary class="tag-title">
                        ${tag} <span class="route-count">${routes.length} endpoints</span>
                    </summary>
                    <div class="tag-content">
                        ${routeCardsHtml}
                    </div>
                </details>
            `;
        }

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
                    --tag-bg: #edf2f7;
                    --tag-text: #4a5568;
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

                main {
                    max-width: 1000px;
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

                /* 드롭다운 (Details & Summary) 스타일 */
                details.tag-group {
                    background: white;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                }

                summary.tag-title {
                    padding: 16px 24px;
                    font-size: 1.15rem;
                    font-weight: 700;
                    cursor: pointer;
                    background-color: #f7fafc;
                    display: flex;
                    align-items: center;
                    user-select: none;
                    list-style: none;
                    border-bottom: 1px solid transparent;
                }

                summary.tag-title::-webkit-details-marker {
                    display: none;
                }

                details[open] summary.tag-title {
                    border-bottom-color: var(--border-color);
                }

                summary.tag-title::before {
                    content: '▶';
                    font-size: 0.8rem;
                    margin-right: 12px;
                    color: var(--text-muted);
                    transition: transform 0.2s ease-in-out;
                }

                details[open] summary.tag-title::before {
                    transform: rotate(90deg);
                }

                .route-count {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin-left: 12px;
                    background: var(--tag-bg);
                    padding: 2px 10px;
                    border-radius: 12px;
                }

                .tag-content {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* API 라우트 카드 스타일 */
                .route-card {
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    overflow: hidden;
                }

                .route-header {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid var(--border-color);
                    gap: 16px;
                }

                .route-body {
                    padding: 20px;
                }

                .summary-text {
                    font-size: 0.95rem;
                    color: var(--text-main);
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                /* 세로 나열 레이아웃 */
                .payload-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .payload-section {
                    background: var(--code-bg);
                    border-radius: 6px;
                    overflow: hidden;
                }

                .payload-title {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 8px 16px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid #4a5568;
                }

                code { 
                    font-size: 1rem; 
                    font-weight: 600; 
                    color: #e53e3e; 
                }

                pre { 
                    color: #e2e8f0; 
                    padding: 16px; 
                    font-size: 0.9rem; 
                    margin: 0; 
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                    font-family: 'Fira Code', Consolas, Monaco, monospace;
                }

                .method { 
                    padding: 6px 12px; 
                    border-radius: 4px; 
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
            </style>
        </head>
        <body>
            <header>
                <div class="brand">api-docgen</div>
            </header>
            
            <main>
                <h1>API Routes Reference</h1>
                <p class="subtitle">Automatically generated documentation for your backend API services.</p>
                
                <div class="api-container">
                    ${contentHtml}
                </div>
            </main>
        </body>
        </html>
        `;

        const filePath = path.join(process.cwd(), 'api-docs.html');
        fs.writeFileSync(filePath, htmlTemplate, 'utf-8');

        let command = '';
        if (process.platform === 'win32') command = `start "" "${filePath}"`; 
        else if (process.platform === 'darwin') command = `open "${filePath}"`; 
        else command = `xdg-open "${filePath}"`; 

        exec(command, (error) => {
            if (error) console.log('Error:', error.message);
        });

        console.log(`
==================================================
Success! API documentation generated.
File: ${filePath}

[Next Step: How to share with your frontend team]
Add the following code to your Express entry file:

app.get('/api-docs', (req, res) => {
    const path = require('path');
    res.sendFile(path.join(process.cwd(), 'api-docs.html'));
});
==================================================
        `);

    } catch (err) {
        console.log('Error: ', err.message);
    }
};

module.exports = {
    generateDocs,
};