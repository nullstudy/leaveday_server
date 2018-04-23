// sign with default (HMAC SHA256) 
const jwt = require('jsonwebtoken');
const secretKey = 'park';
const tokenExpirseIn = 60 * 60 * 24 * 3; //기한 3일

exports.tokenCreate = function(objectId) {
    return new Promise(function(resolve, reject) {
        let token = jwt.sign({ ObjectId: objectId },
            secretKey, { expiresIn: tokenExpirseIn } // 3일
        );
        if (token) {
            resolve(token);
        } else {
            reject(err)
        }
    })
}

exports.authMiddleware = async function(req, res, next) {
    let output = {};
    try {
        let token;
        let bearerHeader = req.headers["authorization"];

        if (typeof bearerHeader !== 'undefined') {
            let bearer = bearerHeader.split(" ");
            token = bearer[1];
        } else {
            res.status(403).send("not Bearer tokenType");
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.redirect('/login');
            } else {
                let tokenData = {};
                tokenData.token = token;
                tokenData.ObjectId = decoded.ObjectId;
                req.body.tokenData = tokenData;

                next();
            }
        });
    } catch (e) {
        output.msg = "fail"
        output.data = null
        res.status(400).send(output);
    }
}


exports.tokenCheck = async function(req, res, next) {
    let output = {};
    try {
        let token;
        let bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            let bearer = bearerHeader.split(" ");
            token = bearer[1];
        } else {
            res.status(403).send("not Bearer tokenType");
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.redirect('/login');
            } else {
                let tokenData = {};
                tokenData.token = token;
                tokenData.ObjectId = decoded.ObjectId;
                req.body.tokenData = tokenData;
                return tokenData
            }
        });
    } catch (e) {
        output.msg = "fail"
        output.data = null
        res.status(400).send(output);
    }
}


exports.tokenSocketCheck = function(token) {
    return new Promise(async function(resolve, reject) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(new Error("Token fail"));
            } else {
                resolve(decoded.ObjectId)
            }
        });
    })
}