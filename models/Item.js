const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    index: {
        type: Number,
    },
    name: {
        type: String,
        default: '',
    },
    modelName: {
        type: String,
        default: ''
    },
    mainImg: {
        type: String,
        default: ''
    },
    additionalImg: {
        type: Array,
        default: []
    },
    content: {
        type: Array,
        default: []
    },
    imgBody: {
        type: Array,
        default: []
    },
    homeNotice: {
        type: Object,
        default: { notice: false, index: null }
    },
    recommend: {
        type: Object,
        default: { recommend: false, index: null }
    },
    noticeContent: {
        type: Object,
        default: { content1: '', content2: '', content3: '' }
    },
    additionalInfo1: { // MOQ
        type: String,
        default: ''
    },
    additionalInfo2: { // per BOX / per Carton
        type: String,
        default: ''
    },
    additionalInfo3: { // Leadtime
        type: String,
        default: ''
    },
    additionalInfo4: { // Samples provided
        type: String,
        default: ''
    },
    additionalInfo5: { // Payment options
        type: String,
        default: ''
    },
    certificate: {
        type: Array,
        default: []
    },
    category: {
        type: String,
        default: ''
    },
    applications: {
        type: Array, // 0 semi-conductor, 1 lead frame, 2 electronic parts
        default: []
    }
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
