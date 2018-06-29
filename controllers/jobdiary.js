var DiaryModel = require('../model/jobdiarydb');
var ObjectId = require('mongodb').ObjectID;
var dbQuery = require('../util/dbQuery');

exports.createDiary =async function(req,res,next){ //leaveDay 정보입력
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        if (userInfo) {
            // for(var i =0; i<40; i++){
                let diary = new DiaryModel();
                diary.author = String(userInfo[0]._id);
                diary.title = String(req.body.title+'테스트');
                diary.content = String(req.body.content);
                diary.state = Number(req.body.state);
                diary.leaveCount = Number(req.body.leaveCount);
                await dbQuery.save(diary);
            // }
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


exports.getDiary =async function(req,res,next){ //leaveDay list
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;

        let sort = { _id: -1 };
        let page = req.query.page || 1;
        let count = 10;
        let pageCount = (page - 1) * count;

        if (userInfo) {

            let countFind =  [
                { $match : {  author : String(userInfo[0]._id)}},
                {'$group' : 
                    {
                        '_id' : null, 
                        'count' : {'$sum' : 1}
                    }
                },
                { $project : {
                    _id : 0,  
                }}
            ];
        
            let getTotal = await dbQuery.aggregate(DiaryModel, countFind); 
            let findData =  [
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
                }},
                { $sort: sort },
                {"$skip":pageCount },
                {"$limit":count }
            ];
        
            let getJobDiary = await dbQuery.aggregate(DiaryModel, findData); 
            
            for(var item in getJobDiary){
                if(getJobDiary[item].state == 1) getJobDiary[item].state = { state: '행복', number : 1 }
                if(getJobDiary[item].state == 2) getJobDiary[item].state = { state: '평온', number : 2 }
                if(getJobDiary[item].state == 3) getJobDiary[item].state = { state: '별로', number : 3 }
                if(getJobDiary[item].state == 4) getJobDiary[item].state = { state: '화남', number : 4 }
                if(getJobDiary[item].state == 5) getJobDiary[item].state = { state: '빡침', number : 5 }
                getJobDiary[item].recordCount = getTotal[0].count;
            }
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

exports.getDetailDiary = async function(req,res,next) {
    const output = {};
    try {
        if (req.params._id) {

            let findData = { "_id": ObjectId(req.params._id) };
            let updateData = { $inc: { views: +1 } }
            let viewsUpdate = await dbQuery.updateDate(DiaryModel, findData,updateData); 

            findData =  [
                { $match : {  _id : ObjectId(req.params._id)}},
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
                }
            ];
            let getJobDiary = await dbQuery.aggregate(DiaryModel, findData); 
            
            for(var item in getJobDiary){
                if(getJobDiary[item].state == 1) getJobDiary[item].state = { state: '행복', number : 1 }
                if(getJobDiary[item].state == 2) getJobDiary[item].state = { state: '평온', number : 2 }
                if(getJobDiary[item].state == 3) getJobDiary[item].state = { state: '별로', number : 3 }
                if(getJobDiary[item].state == 4) getJobDiary[item].state = { state: '화남', number : 4 }
                if(getJobDiary[item].state == 5) getJobDiary[item].state = { state: '빡침', number : 5 }
            }
            output.data = getJobDiary;
            output.msg = 'success';
            res.status(200).send(output);
        } else {
            output.msg = 'data not exist';
            res.status(200).send(output);
        }
    } catch (e) {
        console.log(e);
        output.msg = 'fail';
        res.setHeader('Authorization', tokenCheck.token);
        res.status(404).send(output);
    }
}

exports.editDiary = async function(req,res,next) {
    const output = {};
    try {
        if (req.params._id) {

            let findData = { "_id": ObjectId(req.params._id) };
            let diaryInfo = {
                "title": String(req.body.title),
                "content": String(req.body.content),
                "state": Number(req.body.state),
                "leaveCount": Number(req.body.leaveCount)
            }

            let updateData = { "$set": diaryInfo };
            await dbQuery.updateDate(DiaryModel, findData, updateData);
            output.data = dbQuery;
            output.msg = 'success';
            res.status(200).send(output);
        } else {
            output.msg = 'data not exist';
            res.status(200).send(output);
        }
    } catch (e) {
        console.log(e);
        output.msg = 'fail';
        res.setHeader('Authorization', tokenCheck.token);
        res.status(404).send(output);
    }
}
