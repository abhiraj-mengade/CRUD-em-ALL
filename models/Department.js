const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: String,
    employno: Number
});

module.exports = mongoose.model('Department', authorSchema);