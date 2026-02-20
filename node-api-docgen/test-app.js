  const express = require('express');
  const app = express();

  app.get('/api/users', (req, res) => { res.send('user list'); });
  app.post('/api/users', (req, res) => { res.send('create user'); });
  app.delete('/api/users/:id', (req, res) => { res.send('delete user'); });