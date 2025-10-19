# Quick Start Guide

Get the CCI Startup Project running in 5 minutes!

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (free tier)
- Google Gemini API key (free)

## 1. Install Dependencies (2 minutes)

```bash
# Backend
npm install

# Frontend
cd frontend && npm install && cd ..
```

## 2. Configure Environment (1 minute)

Create `.env` file in project root:

```env
MONGO_URI=your_mongodb_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get MongoDB URI:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Create cluster → Connect → Copy connection string  
**Get Gemini Key:** [Google AI Studio](https://makersuite.google.com/app/apikey) → Create API key

## 3. Build & Seed (1 minute)

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Seed database with sample data
npm run seed
```

## 4. Start Server (30 seconds)

```bash
npm start
```

## 5. Open Browser (30 seconds)

Navigate to: **http://localhost:8080**

## ✅ Done!

You should see:
- 6 restaurants (some open, some closed)
- Budget dashboard showing spending
- AI recipe recommendations

## Quick Test

Test the API endpoints:

```bash
# Get all restaurants
curl http://localhost:8080/api/get_restaurants

# Get budget insights for default user
curl http://localhost:8080/api/budget/507f1f77bcf86cd799439011/insights
```

## Default Test User

- **Username:** norm_niner
- **Password:** password123
- **User ID:** 507f1f77bcf86cd799439011

## Need Help?

- Full setup guide: `RUNNING_THE_APP.md`
- Technical details: `IMPLEMENTATION_SUMMARY.md`
- API documentation: `API_TESTING_GUIDE.md`
- Presentation: Open `presentation.html` in browser

## Troubleshooting One-Liners

**MongoDB won't connect?**  
→ Whitelist your IP in MongoDB Atlas → Network Access → Add IP

**Frontend not showing?**  
→ `cd frontend && npm run build && cd ..` then refresh browser

**Recipe endpoint fails?**  
→ Check `GEMINI_API_KEY` is set in `.env`

---

🎉 **You're all set!** Enjoy exploring the Smart Campus Dining app!
