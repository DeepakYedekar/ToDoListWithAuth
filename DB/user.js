const mongoose = require('mongoose');
const Todo = mongoose.Schema({
    Email: String,
    Password: String,
    Created_At: { type: Date,default:new Date()},
    ToDoList: [{ id: {type:Number,unique:true}, title: { type: String }, isCompleted: { type: String }, Created_At:{type:Date,default:new Date()}}]
})

module.exports = mongoose.model('ToDo', Todo);