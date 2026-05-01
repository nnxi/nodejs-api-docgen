import express from 'express';
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
    res.status(201).json({ success: true });
});

router.post('/no-tag', (req, res) => {
    res.status(201).json({ success: true });
})

export default router;