// var express = require('express');
// var router = express.Router();
/* GET users listing. */
// module.exports = router;

const jsonWebToken = require('../util/token');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const KakaoStrategy = require('passport-kakao').Strategy;
const user = require('../controllers/user');

module.exports = function(app, passport, config) {
    app.get('/', user.userIndex);
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['public_profile', 'email'] }));
    app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['email'] }));
    app.get('/auth/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) { res.redirect('/') });
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) { res.redirect('/') });
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/login' }), function(req, res) { res.redirect('/') });
    passport.serializeUser(function(user, done) { done(null, user) });
    passport.deserializeUser(function(user, done) { done(null, user) });

    passport.use(new FacebookStrategy({
            clientID: config.get('Customer.facebook.clientId'),
            clientSecret: config.get('Customer.facebook.secret'),
            // callbackURL: "https://www.leaveday.cf/auth/facebook/callback",
            callbackURL: "/auth/facebook/callback",
            // profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
            profileFields: ['id', 'email']
        },
        async function(accessToken, refreshToken, profile, done) {
            console.log('여기는 타는 거니?')
            console.log(config.get('Customer.facebook.clientId'))
            console.log(config.get('Customer.facebook.secret'))
            const userId = { email: profile.emails[0].value }
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
                user.email = profile.emails[0].value;
                user.name = profile.displayName;
                user.save(function(err) {
                    if (err) return new Error("add error");
                });
                var userData = {};
                var userToken = await jsonWebToken.tokenCreate(user._id);
                userData._id = user._id
                userData.name = profile.displayName;
                userData.userToken = userToken;
                userData.email = profile.emails[0].value
                done(null, userData);
            }
        }
    ));
    passport.use(new GoogleStrategy({
            clientID: config.get('Customer.google.clientId'),
            clientSecret: config.get('Customer.google.secret'),
            callbackURL: '/auth/google/callback'
        },
        async function(accessToken, refreshToken, profile, done) {
            const userId = { email: profile.emails[0].value }
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
                user.email = profile.emails[0].value;
                user.name = profile.displayName;
                user.save(function(err) {
                    if (err) return new Error("add error");
                });
                var userData = {};
                var userToken = await jsonWebToken.tokenCreate(user._id);
                userData._id = user._id
                userData.name = profile.displayName;
                userData.userToken = userToken;
                userData.email = profile.emails[0].value
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