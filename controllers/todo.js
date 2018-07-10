var TodoModel = require('../model/Todo');
var ObjectId = require('mongodb').ObjectID;
var dbQuery = require('../util/dbQuery');

exports.todoList = async function(req, res, next) { //Todo 찾기
    const output = {};
    try {
        if (req.query._id) {
            let findData =  [
                { $match : {  author: ObjectId(req.query._id) }},
                {
                    $addFields: { active : false }
                },
                { $project : {
                    _id : 1,
                    title : 1,
                    createDT : 1,
                    startDT : 1,
                    endDT: 1,
                    detail : 1,
                    status : 1,
                    active : 1 
                    }
                }
            ];
            let todoInfo = await dbQuery.aggregate(TodoModel, findData); 
            output.msg = 'success';
            output.data = todoInfo;
            res.status(200).send(output);
        } else {
            output.msg = 'not auth';
            res.status(200).send(output);
        }
    } catch (e) {
        console.log(e)
        output.msg = 'fail';
        res.status(404).send(output);
    }
}

exports.todoCreate = async function(req, res, next) { //Todo 만들기
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
            Todo.startDT > Todo.createDT ? Todo.status = 2   : Todo.status = 1   
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

exports.todoUpdate = async function(req,res,next) {
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        if (userInfo) {
            let detail = {
                "_id":req.body.detail_id,
                'todo' : req.body.todo,
                "status": req.body.status
            }
            let findData = { "detail._id": ObjectId(req.body.detail_id)};
            let updateData = {"$set": {"detail.$": detail }};
            let putTodo = await dbQuery.findOneAndUpdate(TodoModel, findData, updateData);

            let find =  [
                { $match : {  author: ObjectId(userInfo._id) }},
                {
                    $addFields: { active : false }
                },
                { $project : {
                    _id : 1,
                    title : 1,
                    createDT : 1,
                    startDT : 1,
                    endDT: 1,
                    detail : 1,
                    status : 1,
                    active : 1 
                    }
                }
            ];
            let todoInfo = await dbQuery.aggregate(TodoModel, find); 
            output.msg = 'success';
            output.data = todoInfo;
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