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


//mongodb save문
exports.save = function(data) {
    return new Promise(function(resolve, reject) {
        data.save(function(err, result) {
            if (err) {
                console.log(err)
                reject(new Error("add error"));
            } else {
                resolve(result);
            }
        });
    });
}

//update
exports.updateDate = function(model, findData, updateData) {
    return new Promise(function(resolve, reject) {
        model.update(findData, updateData, { upsert: true }, function(err, result) {
            if (err) {
                reject(new Error("update error"));
            } else {
                resolve(result);
            }
        })
    })
};

//aggregate
exports.aggregate = function(model, findData) {
    return new Promise(function(resolve, reject) {
        model.aggregate(findData).then(function fulfilled(result) {
            resolve(result);
        }, function rejected(err) {
            reject(new Error("find error"));
        });
    })
};

exports.Find = function(model, data) {
    return new Promise(function(resolve, reject) {
        model.find(data, function(err, result) {
            if (err)
                reject(new Error("err"));
            else if (result != null)
                resolve(result);
            else
                resolve(null);
        });
    });
}

exports.findOption1 = function(model, findData, showData) { //limit추가
    return new Promise(function(resolve, reject) {
        model.find(findData, showData).exec(function(err, result) {
            if (err) {
                console.log(err)
                reject(new Error("add error"));
            } else {
                resolve(result);
            }
        });
    });
}



exports.findLimit = function(model, findData, showData) { //limit추가
    return new Promise(function(resolve, reject) {
        model.find(findData, showData).limit(1).exec(function(err, result) {
            if (err) {
                console.log(err)
                reject(new Error("add error"));
            } else {
                resolve(result[0]);
            }
        });
    });
}


exports.populate = function(model, findData, showData, populatePath, populateSelect) {
    return new Promise(function(resolve, reject) {
        model.find(findData, showData).populate(populatePath, populateSelect).exec(function(err, result) {
            resolve(result);
        }, function rejected(err) {
            reject(new Error("find error"));
        });
    })
};


//mongodb 삭제모듈 => 사용사례없음.
exports.deleteData = function(model, deleteData, callback) {
    return new Promise(function(resolve, reject) {
        Room.remove(deleteData).then(function fulfilled(result) {
            resolve(result);
        }, function rejected(err) {
            reject(new Error("find error"));
        });
    })
};