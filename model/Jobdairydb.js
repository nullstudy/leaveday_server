const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diarySchema = new Schema({
    title: String, // 글제목
    startDT: Date, //TodoList 작성날 시작일
    endDT: Date, //종료날 
    leaveCount: Number, //예측일
    content: String,  // 글내용
    status: Number // 상태  0 안끝남 1 끝남 2 보류 
    // private: Number 
    // favorite: Number 
});
const diaryModel = mongoose.model('Jobdiary', diarySchema);
module.exports = diaryModel;