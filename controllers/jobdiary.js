var DiaryModel = require('../model/jobdiarydb');
var UserModel = require('../model/Userdb')
var ObjectId = require('mongodb').ObjectID;
var dbQuery = require('../util/dbQuery');
const jsonWebToken = require('../util/token');

exports.mainDiary = async function(req,res,next){
 const output = {};
 try {
    let findData =  [
        { $match : { author : String(req.body.userInfo[0]._id) , "date" : { $gte: new Date(req.query.startDT), $lte: new Date(req.query.endDT) }}},
        { $project : {
            _id : 1,
            title : 1,
            content : 1,
            date : { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            views : 1,
            author: 1,
            leaveCount : 1,
            state :  1 
        }}
    ];

    let mainDiary = await dbQuery.aggregate(DiaryModel, findData); 
    for(var item in mainDiary){
        if(mainDiary[item].state == 1) mainDiary[item].state = { state: '행복', number : 1 }
        if(mainDiary[item].state == 2) mainDiary[item].state = { state: '평온', number : 2 }
        if(mainDiary[item].state == 3) mainDiary[item].state = { state: '별로', number : 3 }
        if(mainDiary[item].state == 4) mainDiary[item].state = { state: '화남', number : 4 }
        if(mainDiary[item].state == 5) mainDiary[item].state = { state: '빡침', number : 5 }
    }
    output.data = mainDiary;
    output.msg = 'success';
    res.status(200).send(output);
 } catch (e) {
    console.log(e)
    output.msg = 'fail';
    res.setHeader('Authorization', tokenCheck.token);
    res.status(404).send(output);
 }
} 
exports.createDiary =async function(req,res,next){ //leaveDay 정보입력
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        if (userInfo) {
            
            let diary = new DiaryModel();
            diary.author = String(userInfo[0]._id);
            diary.title = String(req.body.title);
            diary.content = String(req.body.content);
            diary.date = Date(req.body.date);
            diary.state = Number(req.body.state);
            diary.leaveCount = Number(req.body.leaveCount);
            await dbQuery.save(diary);
            
            let findData = { 
                "_id" : ObjectId(userInfo[0]._id) 
            };
            let endDT = new Date(userInfo[0].endDT);
            
            let userSet = {
                "_id":ObjectId(userInfo[0]._id),
                "startDT" : new Date(userInfo[0].startDT),
                "endDT": endDT.setDate(endDT.getDate()- Number(req.body.leaveCount)),
                "leaveCount" : userInfo[0].leaveCount - Number(req.body.leaveCount)
            };
            
            
            let updateData = { "$set": userSet };
            await dbQuery.updateDate(UserModel,findData,updateData);
    
            let userTokendata = {};
            userTokendata._id = userInfo[0]._id;
            userTokendata.name = userInfo[0].name;
            userTokendata.email = userInfo[0].email;
            userTokendata.image = userInfo[0].image;
            userTokendata.startDT = userInfo[0].startDT;
            userTokendata.endDT = endDT;
            userTokendata.leaveCount = userInfo[0].leaveCount - Number(req.body.leaveCount)

            let userToken = await jsonWebToken.tokenCreate(userTokendata);
    
            output.msg = 'success';
            output.data = userToken;
            res.setHeader('Authorization','Bearer '+ userToken);
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
        let count = 20;
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
                if(getJobDiary[item].state == 1) getJobDiary[item].state = { status: '행복', number : 1 }
                if(getJobDiary[item].state == 2) getJobDiary[item].state = { status: '평온', number : 2 }
                if(getJobDiary[item].state == 3) getJobDiary[item].state = { status: '별로', number : 3 }
                if(getJobDiary[item].state == 4) getJobDiary[item].state = { status: '화남', number : 4 }
                if(getJobDiary[item].state == 5) getJobDiary[item].state = { status: '빡침', number : 5 }
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
