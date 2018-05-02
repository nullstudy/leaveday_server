const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diarySchema = new Schema({
    name: String,
    date: Date,
    content: String, 
    state: Number, 
    private: Number, 
    favorite: Number 
});
const diaryModel = mongoose.model('Jobdiary', diarySchema);
module.exports = diaryModel;