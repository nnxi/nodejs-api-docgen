const express = require('express');
const router = express.Router();

// 최종 경로 예상: GET /api/users/
router.get('/', (req, res) => {
    // 구조 분해 할당 테스트
    const { role, page } = req.query;
    res.status(200).json({ message: 'User list fetched' });
});

// 최종 경로 예상: POST /api/users/profile
router.post('/profile', (req, res) => {
    // 일반 변수 할당 테스트
    const username = req.body.username;
    const age = req.body.age;
    res.status(201).json({ created: true });
});

// 최종 경로 예상: DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    // params 객체의 구조 분해 할당 및 상태 코드 생략(200) 테스트
    const { id } = req.params;
    res.json({ deleted: true });
});

module.exports = router;