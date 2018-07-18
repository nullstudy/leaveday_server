const jsonWebToken = require('../util/token');
const ObjectId = require('mongodb').ObjectID;
const query = require('../util/dbQuery');
const UserModel = require('../model/Userdb');
exports.userIndex = async function(req, res, next) { //유저 로그인
    const output = new Object();
    try {
        output.msg = 'success';
        res.redirect('http://localhost:6005/');
    } catch (e) {
        output.msg = 'try fail';
        output.data = null;
        res.send(output);
    }
}


exports.userAuth = async function(req, res, next) { // 로긴 성공
    const output = new Object();
    try {
        res.cookie('userToken', req.session.passport.user.userToken);
        res.setHeader('Authorization','Bearer ' + req.session.passport.user.userToken);
        res.redirect('http://localhost:6005');
        // res.redirect('http://13.209.37.149:6005');
    } catch (e) {
        output.msg = 'try fail';
        console.log(e)
        res.send(output);
    }
}

exports.userCheck = async function(req, res, next) {//사용자 인증
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        let userData = {};
        userData._id = userInfo[0]._id;
        userData.email = userInfo[0].email;
        userData.name = userInfo[0].name;
        userData.image = userInfo[0].image;
        output.msg = 'success';
        output.data = userData;
        res.setHeader('Authorization', 'Bearer ' + tokenCheck.token);
        res.send(output);
    } catch (e) {
        output.msg = "fail";
        output.data = null;
        res.status(500).send(output);
    }
}


exports.userRegister = async function(req, res, next) { // leaveday 등록
    const output = new Object();
    try {
        let tokenCheck = req.body.tokenData;
        let findData = { 
            "_id" : ObjectId(req.body._id) 
        };
        
        let userInfo = {
            "_id":ObjectId(req.body._id),
            "startDT" : new Date(req.body.startDT),
            "endDT": new Date(req.body.endDT),
            "leaveCount" : req.body.leaveCount
        };

        let updateData = { "$set": userInfo };
        await query.updateDate(UserModel,findData,updateData);

        let userTokendata = {};
        userTokendata._id = req.body.userInfo[0]._id;
        userTokendata.name = req.body.userInfo[0].name;
        userTokendata.email = req.body.userInfo[0].email;
        userTokendata.image = req.body.userInfo[0].image;
        userTokendata.startDT = userInfo.startDT;
        userTokendata.endDT = userInfo.endDT;
        userTokendata.leaveCount = req.body.leaveCount;

        let userToken = await jsonWebToken.tokenCreate(userTokendata);

        output.msg = 'success';
        output.data = userToken;
        res.setHeader('Authorization','Bearer '+ userToken);
        res.status(200).send(output);
    } catch (e) {
        output.msg = 'try fail';
        console.log(e);
        res.send(output);
    }
}