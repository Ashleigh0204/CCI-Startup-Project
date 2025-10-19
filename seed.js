import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import UserData from './models/userData.js';
import Transaction from './models/transactions.js';
import Restaurant from './models/restaurants.js';

// Fixed ObjectId for the first user (consistent across seeds)
const FIXED_FIRST_USER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

// Sample data
const sampleUsers = [
    {
        _id: FIXED_FIRST_USER_ID,
        username: 'norm_niner',
        passwordHash: bcrypt.hashSync('password123', 10)
    },
    {
        username: 'jane_smith',
        passwordHash: bcrypt.hashSync('password123', 10)
    },
    {
        username: 'mike_wilson',
        passwordHash: bcrypt.hashSync('password123', 10)
    }
];

const sampleRestaurants = [
    {
        name: 'Crown Restaurant',
        description: 'Fine dining with excellent service and premium steaks',
        keywords: ['fine dining', 'upscale', 'steak', 'romantic'],
        Mopen: '11:00', Mclose: '22:00',
        Topen: '11:00', Tclose: '22:00',
        Wopen: '11:00', Wclose: '22:00',
        Ropen: '11:00', Rclose: '22:00',
        Fopen: '11:00', Fclose: '23:00',
        Sopen: '10:00', Sclose: '23:00',
        Uopen: '10:00', Uclose: '21:00'
    },
    {
        name: 'Wendy\'s',
        description: 'Fast food burgers and fries with fresh ingredients',
        keywords: ['fast food', 'burgers', 'fries', 'casual'],
        Mopen: '06:00', Mclose: '23:00',
        Topen: '06:00', Tclose: '23:00',
        Wopen: '06:00', Wclose: '23:00',
        Ropen: '06:00', Rclose: '23:00',
        Fopen: '06:00', Fclose: '24:00',
        Sopen: '06:00', Sclose: '24:00',
        Uopen: '07:00', Uclose: '23:00'
    },
    {
        name: 'Chick-fil-A',
        description: 'Chicken sandwiches and nuggets with friendly service',
        keywords: ['chicken', 'sandwiches', 'nuggets', 'family-friendly'],
        Mopen: '06:30', Mclose: '22:00',
        Topen: '06:30', Tclose: '22:00',
        Wopen: '06:30', Wclose: '22:00',
        Ropen: '06:30', Rclose: '22:00',
        Fopen: '06:30', Fclose: '22:00',
        Sopen: '06:30', Sclose: '09:00',
        Uopen: 'closed', Uclose: 'closed'
    },
    {
        name: 'Green Garden Cafe',
        description: 'Healthy vegetarian and vegan options with organic ingredients',
        keywords: ['vegetarian', 'vegan', 'healthy', 'organic', 'gluten-free'],
        Mopen: '08:00', Mclose: '20:00',
        Topen: '08:00', Tclose: '20:00',
        Wopen: '08:00', Wclose: '20:00',
        Ropen: '08:00', Rclose: '20:00',
        Fopen: '08:00', Fclose: '21:00',
        Sopen: '09:00', Sclose: '21:00',
        Uopen: '09:00', Uclose: '19:00'
    },
    {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizza with fresh toppings and thin crust',
        keywords: ['pizza', 'italian', 'thin crust', 'delivery'],
        Mopen: '11:00', Mclose: '23:00',
        Topen: '11:00', Tclose: '23:00',
        Wopen: '11:00', Wclose: '23:00',
        Ropen: '11:00', Rclose: '23:00',
        Fopen: '11:00', Fclose: '24:00',
        Sopen: '11:00', Sclose: '24:00',
        Uopen: '12:00', Uclose: '22:00'
    },
    {
        name: 'Whole Foods',
        description: 'Healthy groceries with organic and natural products',
        keywords: ['groceries', 'organic', 'natural', 'health food'],
        Mopen: '08:00', Mclose: '22:00',
        Topen: '08:00', Tclose: '22:00',
        Wopen: '08:00', Wclose: '22:00',
        Ropen: '08:00', Rclose: '22:00',
        Fopen: '08:00', Fclose: '22:00',
        Sopen: '08:00', Sclose: '22:00',
        Uopen: '08:00', Uclose: '22:00'
    },
    {
        name: 'Trader Joe\'s',
        description: 'Unique grocery store with specialty items and organic products',
        keywords: ['groceries', 'organic', 'specialty', 'unique products'],
        Mopen: '08:00', Mclose: '21:00',
        Topen: '08:00', Tclose: '21:00',
        Wopen: '08:00', Wclose: '21:00',
        Ropen: '08:00', Rclose: '21:00',
        Fopen: '08:00', Fclose: '21:00',
        Sopen: '08:00', Sclose: '21:00',
        Uopen: '08:00', Uclose: '21:00'
    },
    {
        name: 'Safeway',
        description: 'Full-service grocery store with pharmacy and deli',
        keywords: ['groceries', 'pharmacy', 'deli', 'full service'],
        Mopen: '06:00', Mclose: '23:00',
        Topen: '06:00', Tclose: '23:00',
        Wopen: '06:00', Wclose: '23:00',
        Ropen: '06:00', Rclose: '23:00',
        Fopen: '06:00', Fclose: '23:00',
        Sopen: '06:00', Sclose: '23:00',
        Uopen: '07:00', Uclose: '22:00'
    },
    {
        name: 'Costco',
        description: 'Wholesale club with bulk groceries and household items',
        keywords: ['groceries', 'bulk', 'wholesale', 'membership'],
        Mopen: '10:00', Mclose: '20:30',
        Topen: '10:00', Tclose: '20:30',
        Wopen: '10:00', Wclose: '20:30',
        Ropen: '10:00', Rclose: '20:30',
        Fopen: '10:00', Fclose: '20:30',
        Sopen: '09:30', Sclose: '20:30',
        Uopen: '10:00', Uclose: '19:00'
    }
];

const sampleUserData = [
    {
        preferences: ['spicy food', 'outdoor seating', 'quick service'],
        diet: 'omnivore',
        goal: 'maintenance',
        budgetAmount: 50,
        timeUnit: 'weekly'
    },
    {
        preferences: ['healthy options', 'vegetarian-friendly'],
        diet: 'vegetarian',
        goal: 'weight_loss',
        budgetAmount: 75,
        timeUnit: 'weekly'
    },
    {
        preferences: ['protein-rich', 'low-carb'],
        diet: 'keto',
        goal: 'weight_gain',
        budgetAmount: 100,
        timeUnit: 'weekly'
    },
];

// Sample transactions will be created after restaurants are inserted
const sampleTransactions = [
    {
        amount: 25.50
    },
    {
        amount: 12.99
    },
    {
        amount: 45.75
    },
    {
        amount: 8.50
    },
    {
        amount: 32.00
    }
];

async function seedDatabase() {
    try {
        console.log('Starting database seed...');
        
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await UserData.deleteMany({});
        await Transaction.deleteMany({});
        await Restaurant.deleteMany({});
        
        
        console.log('Creating users...');
        const createdUsers = await User.insertMany(sampleUsers);
        
        
        console.log('Creating user data...');
        const userDataWithIds = sampleUserData.map((data, index) => ({
            ...data,
            user_id: createdUsers[index]._id
        }));
        await UserData.insertMany(userDataWithIds);
        
        
        console.log('Creating restaurants...');
        const createdRestaurants = await Restaurant.insertMany(sampleRestaurants);
        
        console.log('Creating transactions...');
        const transactionsWithIds = sampleTransactions.map((transaction, index) => ({
            ...transaction,
            user_id: createdUsers[index % createdUsers.length]._id,
            location: createdRestaurants[index % createdRestaurants.length]._id
        }));
        await Transaction.insertMany(transactionsWithIds);
        
        console.log('Database seeded successfully!');
        console.log(`Created: ${createdUsers.length} users, ${sampleUserData.length} user data records, ${sampleRestaurants.length} restaurants, ${sampleTransactions.length} transactions`);
        
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

export { seedDatabase };
