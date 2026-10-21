# CONNECT-Daet.ph - Tourism Impact Assessment and Data Analytics System

## Team 10 Analytics System

This is the **Tourism Impact Assessment and Data Analytics System** for the CONNECT-DAET.ph ecosystem, developed by Team 10 as part of the capstone project at Our Lady of Lourdes College Foundation.

### 🎯 Project Overview

The system serves as the "analytical brain" of Daet's smart tourism ecosystem, aggregating data from all 11 integrated subsystems to provide:

- **Real-time Tourism KPIs** - Revenue, visitor count, and transaction monitoring
- **Predictive Modeling** - AI-powered forecasting for visitor spending and resource strain
- **Sustainability Scoring** - Automated evaluation of tourism policy impact
- **Comprehensive Reports** - Data-driven insights for municipal planning

### 🏗️ Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

### 📁 Project Structure

```
connect-daet-app/
├── src/
│   ├── app/
│   │   ├── (subsystems)/
│   │   │   ├── analytics/     # Real-time Analytics Dashboard
│   │   │   ├── admin/         # Admin Dashboard & Reports
│   │   │   ├── info/          # Team 1
│   │   │   ├── workflow/      # Team 2
│   │   │   ├── museum/        # Team 3
│   │   │   ├── experiences/   # Team 4
│   │   │   ├── programs/      # Team 5
│   │   │   ├── crisis/        # Team 6
│   │   │   ├── shop/          # Team 7
│   │   │   ├── tours/         # Team 8
│   │   │   ├── feedback/      # Team 9
│   │   │   └── rewards/       # Team 11
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   └── ui/
│   │       ├── KPICard.js
│   │       ├── SubsystemBreakdown.js
│   │       └── TimeSeriesChart.js
│   └── lib/
│       ├── supabaseClient.js   # Database connection
│       ├── rewards.js          # Rewards integration hook
│       └── analytics.js        # Analytics functions
├── tailwind.config.js
├── next.config.js
└── package.json
```

### 🚀 Getting Started

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

> Get these from your Supabase project settings

#### 3. Set Up Database (Supabase)

Run this SQL in your Supabase SQL Editor:

```sql
-- Core Profiles for All Users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  user_type TEXT CHECK (user_type IN ('tourist', 'artisan', 'operator', 'admin')),
  PRIMARY KEY (id)
);

-- Rewards Log (Crucial for Analytics)
CREATE TABLE reward_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  subsystem_source TEXT,
  points_earned INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_history ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust as needed)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Reward history is viewable by everyone" ON reward_history
  FOR SELECT USING (true);
```

#### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔗 Rewards Integration

Other teams integrate with the analytics system using the rewards hook:

```javascript
import { addPoints } from '@/lib/rewards';

// Example: Award 50 points when a user scans a museum QR code
const handleScanComplete = async () => {
  const result = await addPoints(
    currentUser.id,      // User UUID
    50,                  // Points to award
    'museum_qr_scan'     // Source identifier
  );
  
  if (result.success) {
    console.log('Points awarded successfully!');
  }
};
```

### 📊 Key Features

#### Analytics Dashboard (`/analytics`)
- Real-time KPI cards (Revenue, Visitors, Transactions)
- Tourism Sustainability Score (0-100)
- Activity trends chart
- Subsystem performance breakdown

#### Admin Dashboard (`/admin`)
- System health monitoring
- Predictive forecasting
- Risk alerts and recommendations
- Recent activity log
- Automated report generation

### 🎨 UI Standards

Following the CONNECT-DAET design system:

- **Primary Color**: `bg-blue-600` (Daet Blue)
- **Card Style**: `rounded-2xl` with shadows
- **Buttons**: `rounded-full` for primary actions
- **Mobile-First**: Optimized for 375px screens
- **Touch Targets**: Minimum 44px height/width

### 📈 Analytics Functions

Key functions available in `src/lib/analytics.js`:

- `getTourismKPIs()` - Aggregate revenue, visitors, transactions
- `calculateSustainabilityScore()` - Compute 0-100 sustainability metric
- `getTimeSeriesData(period)` - Historical activity data
- `getForecast()` - Predictive modeling for next period

### 🔐 Security Notes

- All database queries use Supabase RLS (Row Level Security)
- Environment variables never committed to repository
- User authentication handled by Supabase Auth

### 🚢 Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### 👥 Team 10

**Tourism Impact Assessment and Data Analytics System**

- Perillo, Jerold C.
- Lerum, Andrie S.
- Rasco, Warren D.

**Institution**: Our Lady of Lourdes College Foundation, Daet, Camarines Norte

**Year**: 2026

### 📞 Support

For development questions, contact the Faculty Leads via Facebook Messenger.

---

**Built with ❤️ for the Municipality of Daet**
