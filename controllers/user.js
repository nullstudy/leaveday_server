const jsonWebToken = require('../util/token');

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
        res.redirect('http://localhost:6005/main');
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
        res.setHeader('Authorization',req.session.passport.user.userToken);
        // res.redirect('http://localhost:6005');
        res.redirect('http://13.209.37.149:6005');
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