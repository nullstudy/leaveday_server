var DiaryModel = require('../model/jobdiarydb');
var ObjectId = require('mongodb').ObjectID;
var dbQuery = require('../util/dbQuery');

exports.createDiary =async function(req,res,next){ //leaveDay 정보입력
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        if (userInfo) {
            for(var i =0; i<40; i++){
                let diary = new DiaryModel();
                diary.author = String(userInfo[0]._id);
                diary.title = String(req.body.title+'테스트'+i);
                diary.content = String(req.body.content);
                diary.state = Number(req.body.state);
                diary.leaveCount = Number(req.body.leaveCount);
                await dbQuery.save(diary);
            }
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

        let sort = { _id: -1 };
        let page = req.query.page || 1;
        let count = 10;
        let pageCount = (page - 1) * count;
        if (userInfo) {
            findData =  [
                { $match : {  author : String(userInfo[0]._id)}},
                { $project : {
                    _id : 1,
                    title : 1,
                    content : 1,
                    views : 1,
                    author: 1,
                    date : { $dateToString: { format: "%Y.%m.%d", date: "$date" } },
                    leaveCount : 1,
                    state :  1 
                    }
                },
                { $sort: sort},
                {"$skip":pageCount},
                {"$limit":count}
            ];
            let getJobDiary = await dbQuery.aggregate(DiaryModel, findData); 
            console.log(getJobDiary)
            output.data = getJobDiary;
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

