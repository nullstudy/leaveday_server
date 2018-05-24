const jsonWebToken = require('../util/token');
const ObjectId = require('mongodb').ObjectID;
const query = require('../util/dbQuery');
const UserModel = require('../model/Userdb');
exports.userIndex = async function(req, res, next) { //유저 로그인
    const output = new Object();
    try {
        // const userInfo = await mongoQuery.findOne({ email: req.body.userId });
        // if (userInfo) {
        //     const userPwdCheck = await bcrypt.hashCompare(req.body.userPwd, userInfo.pwd);
        //     if (userPwdCheck == true) {
        //         const userToken = await jsonWebToken.tokenCreate(userInfo._id);
        console.log('여기탈거아니냐 ');
        output.msg = 'success';
        //         output.data = userToken;
        //         res.cookie('userToken', userToken);
        //         res.setHeader('userToken', userToken);
                // res.send(output)
        // res.redirect('http://13.209.37.149:6005/main');
        res.redirect('http://localhost:6005/');
        //     } else {
                // output.msg = 'password incorrect';
        //         res.status(200).json(output);
        //     }
        // } else {
        //     output.msg = 'user not exist';
        //     res.status(200).json(output);
        // }
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

exports.userCheck = async function(req, res, next) { //사용자 인증
    const output = {};
    try {
        let tokenCheck = req.body.tokenData;
        let userInfo = req.body.userInfo;
        let userData = {};
        userData._id = userInfo[0]._id;
        userData.email = userInfo[0].email;
        userData.name = userInfo[0].name;
        // userData.sex = userInfo[0].sex;
        // userData.studentClassInfo = userInfo[0].student;
        output.msg = 'success';
        output.data = userData;
        console.log(output)
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
            "createDT": new Date(),
            "endDT": new Date(req.body.endDT),
            "leaveCount" : req.body.leaveCount+1
        };

        let updateData = { "$set": userInfo };
        await query.updateDate(UserModel,findData,updateData);

        let userTokendata = {};
        userTokendata._id = req.body.userInfo[0]._id;
        userTokendata.name = req.body.userInfo[0].name;
        userTokendata.email = req.body.userInfo[0].email;
        userTokendata.startDT = userInfo.startDT;
        userTokendata.createDT = userInfo.createDT;
        userTokendata.endDT = userInfo.endDT;
        userTokendata.leaveCount = req.body.leaveCount+1;

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