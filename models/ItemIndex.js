const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemIndexSchema = new Schema({
    type: {
        type: String,
        default: 'normal'
    },
    index: {
        type: Number,
        default: 0,
    }
})

const ItemIndex = mongoose.model('ItemIndex', itemIndexSchema);

module.exports = ItemIndex;