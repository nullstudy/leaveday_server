const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: String,
    image: String,
    startDT : Date,
    endDT : Date,
    leaveCount : Number,
    mycontent: [{ type: Schema.Types.ObjectId, ref: 'Jobdariary' }], // class _id 참조    
});
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;