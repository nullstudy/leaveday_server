var DiaryModel = require('../model/jobdiarydb');
var ObjectId = require('mongodb').ObjectID;
var dbQuery = require('../util/dbQuery');

exports.createDiary =async function(req,res,next){ //leaveDay 정보입력
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        if (userInfo) {
            let diary = new DiaryModel();
            diary.day = new Date();
            diary.author = String(userInfo[0].name);
            diary.title = String(req.body.title);
            diary.content = String(req.body.content);
            diary.state = Number(req.body.state);
            diary.leaveCount = Number(req.body.leaveCount);
            await dbQuery.save(diary);
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


exports.getDiary =async function(req,res,next){ //leaveDay 정보입력
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        if (userInfo) {
            let diary = new DiaryModel();
            diary.day = new Date();
            diary.author = String(userInfo[0].name);
            diary.title = String(req.body.title);
            diary.content = String(req.body.content);
            diary.state = Number(req.body.state);
            diary.leaveCount = Number(req.body.leaveCount);
            await dbQuery.save(diary);
            output.msg = 'success';
            res.status(200).send(output);
        } else {
            output.msg = 'not auth';
            res.setHeader('Authorization', tokenCheck.token);
            res.status(200).send(output);
        }
    } catch (e) {
        console.log(e);
        output.msg = 'fail';
        res.setHeader('Authorization', tokenCheck.token);
        res.status(404).send(output);
    }
}

