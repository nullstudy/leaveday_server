
module.exports = function(app) {
    app.get('/test', function(req, res, next) {
        res.status(200).json('test');
    });
    app.get('/test2', function(req, res, next) {
        console.log('qwe');
        var output = {};
        output.msg = 'success';
        res.status(200).json(output);
    });
}
