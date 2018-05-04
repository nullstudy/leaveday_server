const jsonWebToken = require('../util/token');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const KakaoStrategy = require('passport-kakao').Strategy;
const UserModel = require('../model/Userdb');
const dbQuery = require('../util/dbQuery');
const userController = require('../controllers/user');
const userUtil = require('../util/userCheck');
module.exports = function(app, passport, config) {
    
    app.get('/', userController.userIndex);
    app.get('/loginSuccess', userController.userAuth);
    app.get('/userInfo',jsonWebToken.authMiddleware,userUtil.userVerify,userController.userCheck);
    
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) { res.redirect('/loginSuccess') });
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/login' }), function(req, res) { res.redirect('/') });
    passport.serializeUser(function(user, done) { done(null, user) });
    passport.deserializeUser(function(user, done) { done(null, user) });

    passport.use(new GoogleStrategy({
            clientID: config.get('Customer.google.clientId'),
            clientSecret: config.get('Customer.google.secret'),
            callbackURL: 'https://www.leaveday.cf/auth/google/callback'
            // callbackURL: '/auth/google/callback'
        },
        async function(accessToken, refreshToken, profile, done) {
            const userId = { email: profile.emails[0].value }
            const userInfo = await dbQuery.FindOne(UserModel, userId);
            if (userInfo) {

                let userTokendata = {}; //토큰저장
                userTokendata._id = userInfo._id
                userTokendata.name = userInfo.name
                userTokendata.email = userInfo.email
                var userToken = await jsonWebToken.tokenCreate(userTokendata);
                // var userToken = await jsonWebToken.tokenCreate(userInfo._id);
                //패스포트
                var userData = {};
                userData._id = userInfo._id;
                userData.name = userInfo.name;
                userData.userToken = userToken;
                userData.email = userInfo.email;
                done(null, userData);
            } else {
                //디비저장
                let user = new UserModel();
                user.email = profile.emails[0].value;
                user.name = profile.displayName;
                user.save(function(err) {
                    if (err) return new Error("add error");
                });
                
                let userTokendata = {}; //토큰저장
                userTokendata._id = user._id
                userTokendata.name = profile.displayName;
                userTokendata.email = profile.emails[0].value;
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
                var userToken = await jsonWebToken.tokenCreate(userInfo._id);
                var userData = {};
                userData._id = userInfo._id;
                userData.name = userInfo.name;
                userData.userToken = userToken;
                userData.email = userInfo.email;
                done(null, userData);
            } else {
                let user = new UserModel();
                user.email = profile._json.kaccount_email;
                user.name = profile.displayName;
                user.save(function(err) {
                    if (err) return new Error("add error");
                });
                var userData = {};
                var userToken = await jsonWebToken.tokenCreate(user._id);
                userData._id = user._id
                userData.name = profile.displayName;
                userData.userToken = userToken;
                userData.email = profile._json.kaccount_email
                done(null, userData);
            }
        }
    ));

}