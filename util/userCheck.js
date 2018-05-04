const User = require('../model/Userdb');
const mongoQuery = require('../util/dbQuery');

exports.userVerify = async function(req, res, next) { // 유저검증 
    let output = {};
    let tokenCheck = req.body.tokenData;
    let findData = { _id: tokenCheck.ObjectId };
    let userInfo = await mongoQuery.getUserFind(User, findData);

    if (userInfo == 0 || userInfo == undefined) {
        output.msg = "user not exist";
        return res.status(400).send(output);
    }
    req.body.userInfo = userInfo;
    next();
};