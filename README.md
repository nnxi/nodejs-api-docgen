# nodejs-api-docgen

[![NPM Version](https://img.shields.io/npm/v/nodejs-api-docgen.svg)](https://www.npmjs.com/package/nodejs-api-docgen)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black.svg?logo=github)](https://github.com/nnxi/nodejs-api-docgen)

Generate clean Express API docs directly from route comments using AST.
A zero-config API documentation tool that helps you share API specifications with your team seamlessly.

## Installation

Install the package globally to use the CLI from anywhere:

```bash
npm install -g nodejs-api-docgen
```

*(Alternatively, you can install it as a dev dependency in your project: `npm i -D nodejs-api-docgen`)*

## Usage

Run the command in your terminal, pointing to your Express main file or router file. By default, it looks for `app.js`.

```bash
api-docgen [path]
```

### Options

* `--strict` : Only generate documentation for routes explicitly marked with the `@api-docgen` tag.
* `-h, --help` : Print command line options.
* `-v, --version` : Print current version.

Example:
```bash
api-docgen src/app.js --strict
```

## Comment Block Format

To document a route, place a JSDoc-style comment block directly above the router definition. 

Supported tags:
* `@api-docgen` : Required if using `--strict` mode.
* `@tag` : Group name for the accordion UI.
* `@summary` : Short description of the route.
* `@req` : Request input details (e.g., body, params, query).
* `@res` : Response output details and status codes.

```javascript
/**
 * @api-docgen
 * @tag Users
 * @summary Create a new user
 * @req body { username: string, email: string }
 * @res 201 { success: true, userId: number }
 * @res 400 { success: false, message: string }
 */
router.post('/users', (req, res) => {
    // Implement user creation logic
});
```

## Sharing with Team

Upon running the command, an `api-docs.html` file will be generated in your current directory. 
To serve this interactive document to your team, simply add the following route to your Express application:

```javascript
const path = require('path');

// Serve the generated API documentation
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'api-docs.html'));
});
```

Now, your team can view the live, updated documentation at `http://your-server-url/api-docs`.

## License

[MIT](LICENSE)
