const express = require('express');
const app = express();

import postRouter from './routes/post.js';
const userRouter = require('./routes/user');

app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});