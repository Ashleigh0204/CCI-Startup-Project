const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    keywords: {
        type: [String],
        default: []
    },
    // Monday
    Mopen: {
        type: String,
        required: true
    },
    Mclose: {
        type: String,
        required: true
    },
    // Tuesday
    Topen: {
        type: String,
        required: true
    },
    Tclose: {
        type: String,
        required: true
    },
    // Wednesday
    Wopen: {
        type: String,
        required: true
    },
    Wclose: {
        type: String,
        required: true
    },
    // Thursday
    Ropen: {
        type: String,
        required: true
    },
    Rclose: {
        type: String,
        required: true
    },
    // Friday
    Fopen: {
        type: String,
        required: true
    },
    Fclose: {
        type: String,
        required: true
    },
    // Saturday
    Sopen: {
        type: String,
        required: true
    },
    Sclose: {
        type: String,
        required: true
    },
    // Sunday
    Uopen: {
        type: String,
        required: true
    },
    Uclose: {
        type: String,
        required: true
    }
}, { timestamps: true });

// check status of restaurant
restaurantSchema.virtual('isOpen').get(function() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format
    
    // Map day numbers to schema field prefixes
    const dayMap = {
        0: 'U', // Sunday
        1: 'M', // Monday
        2: 'T', // Tuesday
        3: 'W', // Wednesday
        4: 'R', // Thursday
        5: 'F', // Friday
        6: 'S'  // Saturday
    };
    
    const dayPrefix = dayMap[currentDay];
    const openTime = this[`${dayPrefix}open`];
    const closeTime = this[`${dayPrefix}close`];
    
    if (!openTime || !closeTime) return false;
    
    const openTimeNum = parseInt(openTime.replace(':', ''));
    const closeTimeNum = parseInt(closeTime.replace(':', ''));
    
    if (closeTimeNum < openTimeNum) {
        return currentTime >= openTimeNum || currentTime <= closeTimeNum;
    }
    
    return currentTime >= openTimeNum && currentTime <= closeTimeNum;
});

// serialize virtual fields
restaurantSchema.set('toJSON', { virtuals: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
