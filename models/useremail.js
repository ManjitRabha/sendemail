const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const useremailSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const useremail = mongoose.model('useremail', useremailSchema);
module.exports = useremail;