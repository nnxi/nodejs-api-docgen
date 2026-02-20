#!/usr/bin/env node

const {Parser} = require("./src/parser");

const targetCode = `
  const express = require('express');
  const app = express();

  app.get('/api/users', (req, res) => { res.send('user list'); });
  app.post('/api/users', (req, res) => { res.send('create user'); });
  app.delete('/api/users/:id', (req, res) => { res.send('delete user'); });
`;


try {
    console.log("api-docgen is running");

    Parser(targetCode);
} catch (err) {
    console.log("err : ", err.message);
}