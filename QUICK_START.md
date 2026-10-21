# ⚡ Quick Start Guide - Get Running in 5 Minutes

## For the Impatient (TL;DR)

```bash
# 1. Install dependencies
cd connect-daet-app
npm install

# 2. Create .env.local file
# Copy your Supabase keys here
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local

# 3. Run the database schema in Supabase SQL Editor
# Copy/paste DATABASE_SCHEMA.sql

# 4. Start the server
npm run dev

# 5. Open http://localhost:3000
```

Done! 🎉

---

## Detailed 5-Minute Setup

### ⏱️ Minute 1: Get Supabase Keys

1. Go to [supabase.com](https://supabase.com)
2. Create new project: **CONNECT-Daet**
3. Copy **URL** and **anon key** from Settings → API

### ⏱️ Minute 2: Install Project

```bash
cd connect-daet-app
npm install
```

(While npm installs, do the next step...)

### ⏱️ Minute 3: Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx
```

### ⏱️ Minute 4: Set Up Database

1. In Supabase, open **SQL Editor**
2. Copy entire contents of `DATABASE_SCHEMA.sql`
3. Paste and click **Run**

You should see: "Success. No rows returned"

### ⏱️ Minute 5: Launch!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Quick Test

### Test 1: Can you see the landing page?
✅ Homepage with two cards (Analytics & Admin)

### Test 2: Does Analytics Dashboard load?
✅ Navigate to `/analytics` - shows 0 values (normal)

### Test 3: Does Admin Dashboard load?
✅ Navigate to `/admin` - shows "Operational" status

### Test 4: Can you generate a report?
✅ Click "Generate Report" button in Admin

**All working?** You're ready to code! 🚀

---

## 🎨 Optional: Add Sample Data

Want to see charts with data?

### Option A: Via Browser Console

1. Go to `/analytics`
2. Open browser console (F12)
3. Paste this:

```javascript
// Note: Replace with a real user ID after creating a test user
const testUserId = 'your-uuid-here';

fetch('/api/test-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: testUserId })
});
```

### Option B: Via SQL

In Supabase SQL Editor:

```sql
-- 1. Create a test user profile
INSERT INTO profiles (id, full_name, user_type, points) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Test Tourist', 'tourist', 0);

-- 2. Add sample transactions
INSERT INTO reward_history (user_id, subsystem_source, points_earned) VALUES
  ('11111111-1111-1111-1111-111111111111', 'museum_qr_scan', 50),
  ('11111111-1111-1111-1111-111111111111', 'tour_booking', 100),
  ('11111111-1111-1111-1111-111111111111', 'shop_purchase', 75);

-- 3. Refresh your analytics dashboard
```

Now you'll see data in your charts! 📊

---

## 🐛 Common Issues

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Missing environment variables"
Check `.env.local` exists and has correct format

### "Failed to fetch" in console
- Verify Supabase project is not paused
- Check RLS policies are enabled
- Try disabling browser extensions

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

---

## 📱 Test on Mobile

1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Replace `localhost` with your IP: `http://192.168.x.x:3000`
3. Open on your phone (must be same WiFi)

---

## 🎯 Next Steps

1. ✅ **Read DEVELOPER_GUIDE.md** - Learn integration
2. ✅ **Customize your subsystem** - Add your team's features
3. ✅ **Test rewards integration** - Call `addPoints()`
4. ✅ **Join team communication** - Facebook Messenger

---

## 🆘 Need Help?

### Before asking:
- ✅ Check INSTALLATION.md for detailed steps
- ✅ Review troubleshooting section above
- ✅ Search error message in documentation

### Ask Faculty:
- Via Facebook Messenger
- Include: error message, what you tried, screenshots

---

## 🎉 You're Ready!

Your Team 10 Analytics System is now running.

Time to build something amazing for Daet! 💪

**Good luck!** 🚀
