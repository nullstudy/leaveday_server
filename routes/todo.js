
const jsonWebToken = require('../util/token');
const userUtil = require('../util/userCheck');
const todoController = require('../controllers/todo');

module.exports = function(app) {
    app.get('/todoList',todoController.todoList); // todoList 출력
    app.put('/todoUpdate',jsonWebToken.authMiddleware,userUtil.userVerify,todoController.todoUpdate);// detailTodo finish 
    app.post('/todoCreate',jsonWebToken.authMiddleware,userUtil.userVerify,todoController.todoCreate); //todoList 생성
}