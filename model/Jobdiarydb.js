const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diarySchema = new Schema({
    title: String, // 글제목
    content: String,  // 글내용,
    author : String,
    state : Number, // 빡침,화남,별로,평온,행복 
    date: Date, //TodoList 작성날 시작일
    views: { type: Number, default : 0 }, 
    leaveCount: Number, // 깍을 day count
    updated: [{content: String, date: { type: Date, default: new Date()}}],
    deleted: {type: Boolean, default: false} // true면 삭제 된 경우임
});
const diaryModel = mongoose.model('Jobdiary', diarySchema);
module.exports = diaryModel;