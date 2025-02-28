const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        default: 'normal'
    },
    index: {
        type: Number,
        default: 0,
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
