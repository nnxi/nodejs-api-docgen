const express = require('express');
const router = express.Router();

/**
 * @api-docgen
 * @tag Users
 * @summary Create a new user
 * @req body { username: string, email: string }
 * @res 201 { success: true, userId: number }
 * @res 400 { success: false, message: string }
 */
router.post('/', (req, res) => {
    const { username, email } = req.body;
    res.status(201).json({ success: true, userId: 1 });
});

/**
 * @api-docgen
 * @tag Users
 * @summary Delete a user
 * @req param { id: number }
 * @req query { aaa: number }
 * @res 200 { success: true }
 */
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).json({ success: true });
});

module.exports = router;