
module.exports = function(app) {
    app.get('/test', function(req, res, next) {
        res.status(200).json('test');
    });
}
