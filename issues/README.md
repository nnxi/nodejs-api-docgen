# Bug Reports

If you encounter any issues while using `nodejs-api-docgen`, please report them by creating a new markdown file in this folder, or by opening an issue on GitHub.

When reporting a bug, providing detailed information helps us resolve it faster.

## How to Report

Please include the following information in your report:

### 1. Environment Details
- **Node.js version:** (e.g., v18.16.0)
- **Express version:** (e.g., 4.18.2)
- **nodejs-api-docgen version:** (e.g., 1.0.0)
- **OS:** (e.g., macOS Sonoma, Windows 11)

### 2. Steps to Reproduce
Provide a clear, step-by-step guide to reproduce the issue.
1.
2.
3.

### 3. Expected vs Actual Behavior
- **Expected Behavior:** Briefly describe what you expected to happen.
- **Actual Behavior:** Briefly describe what actually happened (include error messages if any).

### 4. Code Snippet
Provide the specific router code and JSDoc comment block that caused the issue.

```javascript
// Provide the router code that caused the issue
/**
 * @api-docgen
 * @tag Example
 * @req body { test: string }
 */
router.post('/example', (req, res) => {
    // Router logic here
});
```