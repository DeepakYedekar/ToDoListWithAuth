const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
require('./DB/connection');
const { TodoList } = require('./route/user');
app.use(TodoList);
app.listen(3000, () => {
    console.log('server started');
})