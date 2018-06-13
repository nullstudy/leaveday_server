var TodoModel = require('../model/Todo');
var ObjectId = require('mongodb').ObjectID;
var dbQuery = require('../util/dbQuery');
exports.todoCreate = async function(req, res, next) { //강좌 만들기
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;

        if (userInfo) {
            let Todo = new TodoModel();

            Todo.author = ObjectId(userInfo[0]._id);
            Todo.title = req.body.title;
            Todo.createDT = new Date();
            Todo.startDT = new Date(req.body.startDT)
            Todo.endDT = new Date(req.body.endDT);
            Todo.detail = req.body.detail;
            await dbQuery.save(Todo);
            output.msg = 'success';
            res.status(200).send(output);
        } else {
            output.msg = 'not auth';
            res.setHeader('Authorization', tokenCheck.token);
            res.status(200).send(output);
        }
    } catch (e) {
        console.log(e)
        output.msg = 'fail';
        res.setHeader('Authorization', tokenCheck.token);
        res.status(404).send(output);
    }
}