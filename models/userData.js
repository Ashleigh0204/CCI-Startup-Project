import mongoose from 'mongoose';
const Schema = mongoose.Schema; 

const userDataSchema = new Schema ({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    preferences: {
        type: [String],
        required: true,
        default: []
    },
    diet: {
        type: String,
        required: true,
    }, 
    goal: {
        type: String,
        required: true,
    }, 
    budgetAmount: {
        type: Number,
        required: true,
        min: 0
    }, 
    timeUnit: {
        type: String,
        required: true,
        enum: ['daily', 'weekly', 'monthly']
    }
}, { timestamps: true }); 

const UserData = mongoose.model('UserData', userDataSchema);

export default UserData;
