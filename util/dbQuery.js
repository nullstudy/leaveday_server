exports.FindOne = function(model, data) {
    return new Promise(function(resolve, reject) {
        model.findOne(data, function(err, result) {
            if (err)
                reject(new Error("err"));
            else if (result != null)
                resolve(result);
            else
                resolve(null);
        });
    });
}