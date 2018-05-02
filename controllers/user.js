
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
        res.redirect('http://13.209.37.149:6005/main');
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