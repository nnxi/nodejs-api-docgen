const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    const role = req.query.role;
    const page = req.query.page;
    res.json({ message: 'user list fetched' });
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ status: 'success' });
});

app.post('/api/users', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const age = req.body.age;
    res.json({ created: true });
});

app.put('/api/users/:id', (req, res) => {
    const targetId = req.params.id;
    const newPassword = req.body.password;
    res.send('user updated');
});

app.delete('/api/users/:id', (req, res) => {
    const deleteId = req.params.id;
    res.json({ deleted: true });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});