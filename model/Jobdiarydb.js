const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diarySchema = new Schema({
    title: String, // 글제목
    content: String,  // 글내용,
    author : String,
    state : Number, // 빡침,화남,별로,평온,행복 
    day: Date, //TodoList 작성날 시작일
    views: Number,//조회수 
    leaveCount: Number, // 깍을 day count
});
const diaryModel = mongoose.model('Jobdiary', diarySchema);
module.exports = diaryModel;