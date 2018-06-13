const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    author	:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
    title: String,
    createDT: Date,
    startDT : Date,
    endDT : Date,
    detail: [{
        todo: String, 
        status: Boolean
    }],
    status :  { type: Boolean, default: false }
});
const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;