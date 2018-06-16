const jsonWebToken = require('../util/token');
const userUtil = require('../util/userCheck');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const KakaoStrategy = require('passport-kakao').Strategy;
const UserModel = require('../model/Userdb');
const dbQuery = require('../util/dbQuery');
const userController = require('../controllers/user');



module.exports = function(app, passport, config) {
    app.get('/', userController.userIndex);
    app.get('/loginSuccess', userController.userAuth);
    app.get('/userInfo',jsonWebToken.authMiddleware,userUtil.userVerify,userController.userCheck);
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) { res.redirect('/loginSuccess') });
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/login' }), function(req, res) { res.redirect('/loginSuccess') });
    app.put('/leaveInsert',jsonWebToken.authMiddleware,userUtil.userVerify,userController.userRegister); //leaveDay 등록

    passport.serializeUser(function(user, done) { done(null, user) });
    passport.deserializeUser(function(user, done) { done(null, user) });
    passport.use(new GoogleStrategy({
            clientID: config.get('Customer.google.clientId'),
            clientSecret: config.get('Customer.google.secret'),
            // callbackURL: 'https://www.leaveday.cf/auth/google/callback'
            callbackURL: '/auth/google/callback'
        },
        async function(accessToken, refreshToken, profile, done) {
            const userId = { email: profile.emails[0].value }
            const userInfo = await dbQuery.FindOne(UserModel, userId);
            if (userInfo) {
                var userData = await tokenSave(userInfo)
                done(null,userData);
            } else {
                //디비저장
                let user = new UserModel();
                user.email = profile.emails[0].value;
                user.name = profile.displayName;
                user.image = profile.photos[0].value
                user.save(function(err) {
                    if (err) return new Error("add error");
                });
                
                let userTokendata = {}; //토큰저장
                userTokendata._id = user._id
                userTokendata.name = profile.displayName;
                userTokendata.email = profile.emails[0].value
                userTokendata.image = profile.photos[0].value
                userTokendata.startDT = false
                userTokendata.endDT = false
                userTokendata.leaveCount = false
                let userToken = await jsonWebToken.tokenCreate(userTokendata);
                let userData = {}; //패스포트 저장.
                userData._id = user._id
                userData.name = profile.displayName;
                userData.userToken = userToken;
                userData.email = profile.emails[0].value;
                done(null, userData);
            }
        }
    ));
    passport.use('kakao-login', new KakaoStrategy({
            clientID: config.get('Customer.kakao.clientId'),
            clientSecret: config.get('Customer.kakao.secret'),
            callbackURL: '/auth/kakao/callback'
        },
        async function(accessToken, refreshToken, profile, done) {
            const userId = { email: profile._json.kaccount_email }
            const userInfo = await dbQuery.FindOne(UserModel, userId);
            if (userInfo) {
                var userData = await tokenSave(userInfo)
                done(null, userData);
            } else {
                let user = new UserModel();
                user.email = profile._json.kaccount_email;
                user.name = profile.displayName;
                profile._json.properties.thumbnail_image 
                ? user.image = profile._json.properties.thumbnail_image : user.image = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
                user.save(function(err) {
                    if (err) return new Error("add error");
                });
                let userTokendata = {}; //토큰저장
                userTokendata._id = user._id
                userTokendata.name = profile.displayName;
                userTokendata.email = user.email
                userTokendata.image = user.image
                userTokendata.startDT = false
                userTokendata.endDT = false
                userTokendata.leaveCount = false
                var userToken = await jsonWebToken.tokenCreate(userTokendata);
                userData._id = user._id
                userData.name = profile.displayName;zco
                userData.userToken = userToken;
                userData.email = profile._json.kaccount_email
                done(null, userData);
            }
        }
    ));
    async function tokenSave(userInfo) {
        let userTokendata = {}; //토큰저장
        userTokendata._id = userInfo._id
        userTokendata.name = userInfo.name
        userTokendata.email = userInfo.email
        userTokendata.image = userInfo.image
        userTokendata.startDT = userInfo.startDT
        userTokendata.endDT = userInfo.endDT
        userTokendata.leaveCount = userInfo.leaveCount
        var userToken = await jsonWebToken.tokenCreate(userTokendata);
        //패스포트
        var userData = {};
        userData._id = userInfo._id;
        userData.name = userInfo.name;
        userData.userToken = userToken;
        userData.email = userInfo.email;
        return userData;
    }

}