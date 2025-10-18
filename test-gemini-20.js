const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini20Flash() {
    try {
        console.log('Testing Gemini 2.0 Flash...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const result = await model.generateContent("Say hello in one word");
        const response = await result.response;
        const text = response.text();
        
        console.log('Success! Response:', text);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testGemini20Flash();
