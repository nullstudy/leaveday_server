
const jsonWebToken = require('../util/token');
const userUtil = require('../util/userCheck');
const diaryController = require('../controllers/jobdiary');

module.exports = function(app) {
    app.get('/jobDiary',jsonWebToken.authMiddleware,userUtil.userVerify,diaryController.getDiary);
    app.put('/jobDiary/edit/:_id',diaryController.editDiary);
    app.get('/jobDiary/detail/:_id',diaryController.getDetailDiary);
    app.post('/jobDiary/create',jsonWebToken.authMiddleware,userUtil.userVerify,diaryController.createDiary);
}
