//@api-docgen

const express = require('express');
const app = express();

// 외부 라우터 모듈 불러오기 (확장자 생략됨)
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

// 1. 메인 앱에 직접 연결된 API (부모 경로 없음)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is healthy' });
});

// 2. 라우터 위임 (부모 경로 '/api/users' 부여)
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});