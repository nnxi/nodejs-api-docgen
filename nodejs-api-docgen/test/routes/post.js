const express = require('express');
const router = express.Router();

/**
 * @api-docgen
 * @tag Posts
 * @summary Retrieve all posts
 * @req query { page: number, limit: number }
 * @res 200 { success: boolean, data: Array<{id: number, title: string}> }
 */
router.get('/', (req, res) => {
    const { page, limit } = req.query;
    res.status(200).json({ success: true, data: [] });
});

/**
 * @api-docgen
 * @tag Posts
 * @summary Retrieve a specific post by ID
 * @req param { id: number }
 * @res 200 { success: boolean, data: { id: number, title: string, content: string } }
 * @res 404 { success: false, message: string }
 */
router.get('/:id', (req, res) => {
    const postId = req.params.id;
    res.status(200).json({ success: true, data: { id: postId, title: 'Test', content: 'Content' } });
});

/**
 * @tag Hidden
 * @summary Secret admin post route
 * @res 201 { success: boolean }
 */
router.post('/secret', (req, res) => {
    // @api-docgen 태그가 없으므로 strict 모드에서는 문서화되지 않아야 합니다.
    res.status(201).json({ success: true });
});

module.exports = router;