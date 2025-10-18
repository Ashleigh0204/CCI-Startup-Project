const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const transactionSchema = new Schema ({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'UserData',
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true }); 

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;