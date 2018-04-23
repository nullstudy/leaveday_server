module.exports = function(config) {
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function() {
        console.log("Connected to mongod server");
    });
    mongoose.connect(`mongodb://${config.get('Customer.dbConfig.host')}/${config.get('Customer.dbConfig.dbName')}`);
}