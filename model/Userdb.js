const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: String,
    createDT: { type: String, default: new Date() }, //입사일
    fixLeaveDT: { type: String, default: new Date() }, //고정퇴사일
    leaveCount: Number, //고정퇴사일
    mycontent: [{ type: Schema.Types.ObjectId, ref: 'Jobdariary' }], // class _id 참조
    // sex: { type: Boolean, default: false }, 
});
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;