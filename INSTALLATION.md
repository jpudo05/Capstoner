# Installation Guide - CONNECT-DAET Analytics System

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js (LTS Version)** - [Download here](https://nodejs.org/)
   - Verify installation: `node --version` (should be v18+ or v20+)
2. **Git** - [Download here](https://git-scm.com/)
3. **VS Code** (Recommended) - [Download here](https://code.visualstudio.com/)
   - Install "Tailwind CSS IntelliSense" extension

## Step 1: Clone the Repository

```bash
git clone [INSERT_REPO_URL_HERE]
cd connect-daet-app
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Tailwind CSS
- Supabase JS Client
- ESLint

## Step 3: Set Up Supabase

### 3.1 Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Click "New Project"
4. Name it: **CONNECT-Daet**
5. Choose a strong database password
6. Select region closest to Philippines (Singapore recommended)

### 3.2 Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3.3 Create Environment File

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual keys from step 3.2.

⚠️ **Never commit this file to Git!** (It's already in .gitignore)

## Step 4: Set Up Database Schema

### 4.1 Open SQL Editor

1. In Supabase, go to **SQL Editor**
2. Click **+ New Query**

### 4.2 Run the Schema Script

Copy the entire contents of `DATABASE_SCHEMA.sql` and paste it into the SQL editor.

Click **Run** to execute the script.

This creates:
- `profiles` table
- `reward_history` table
- Sample subsystem tables
- Security policies
- Helper functions

### 4.3 Verify Tables

Go to **Table Editor** in Supabase. You should see:
- ✅ profiles
- ✅ reward_history
- ✅ museum_artifacts
- ✅ shop_products
- ✅ tours_listings
- ✅ feedback_submissions
- (and more)

## Step 5: Enable Authentication (Optional)

If you want to test with real user accounts:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

For development, you can create test users manually:

```sql
-- In SQL Editor
INSERT INTO auth.users (email, encrypted_password) VALUES
  ('test@example.com', crypt('password123', gen_salt('bf')));
```

## Step 6: Run the Development Server

```bash
npm run dev
```

You should see:

```
> connect-daet-app@0.1.0 dev
> next dev

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Verify Installation

### Test the Landing Page
- ✅ You should see the CONNECT-Daet.ph homepage
- ✅ Two cards: "Analytics Dashboard" and "Admin Dashboard"

### Test the Analytics Dashboard
- Navigate to `/analytics`
- You should see:
  - KPI cards showing 0 values (normal for fresh install)
  - Empty chart with message "No time series data available yet"
  - Subsystem breakdown showing "No subsystem data available yet"

### Test the Admin Dashboard
- Navigate to `/admin`
- You should see:
  - System Health showing "Operational"
  - Forecast section
  - Empty activity log

## Step 8: Create Sample Data (Optional)

To see the dashboards in action, add some sample data:

```javascript
// In browser console or create a test script
import { addPoints } from '@/lib/rewards';

// You'll need a real user ID from profiles table
const testUserId = 'your-user-uuid-here';

await addPoints(testUserId, 50, 'museum_qr_scan');
await addPoints(testUserId, 100, 'tour_booking');
await addPoints(testUserId, 75, 'shop_purchase');
```

Refresh the analytics dashboard to see your data!

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Check that `.env.local` exists and contains the correct keys.

### Issue: "Failed to fetch" errors in browser console

**Solution**: 
1. Verify Supabase project is active (not paused)
2. Check that RLS policies are set up correctly
3. Try disabling RLS temporarily for testing

### Issue: `npm install` fails

**Solution**:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm cache clean --force`
4. Run `npm install` again

### Issue: Port 3000 already in use

**Solution**: Run on a different port:
```bash
npm run dev -- -p 3001
```

## Next Steps

1. **Read DEVELOPER_GUIDE.md** - Learn how to integrate other subsystems
2. **Customize your subsystem folder** - Create your team's pages
3. **Test the rewards integration** - Award points from your subsystem
4. **Join the development channel** - Facebook Messenger for team coordination

## Production Deployment

When ready to deploy:

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

---

**Need help?** Contact Faculty Leads via Facebook Messenger.

**Happy coding!** 🚀
