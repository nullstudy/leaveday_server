
const jsonWebToken = require('../util/token');
const userUtil = require('../util/userCheck');
const todoController = require('../controllers/todo');

module.exports = function(app) {
    app.get('/todoList',todoController.todoList);
    app.post('/todoCreate',jsonWebToken.authMiddleware,userUtil.userVerify,todoController.todoCreate);
}