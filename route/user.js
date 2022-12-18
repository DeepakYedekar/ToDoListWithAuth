const { getList, signIn, signUp, addList ,updateList} = require('../controller/user');
const route = require('express').Router();

route.get('/get', getList);
route.post('/signin', signIn);
route.post('/signup', signUp);
route.post('/addList', addList);
route.put('/updateList', updateList);

module.exports = {
    TodoList: route
}
