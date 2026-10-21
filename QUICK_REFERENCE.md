# Quick Reference Card

## Tourism Impact Assessment System - Team 10

---

## 🎨 Color Coding (Use These Exact Classes)

```javascript
// PRIMARY (Daet Blue)
className="bg-blue-600"       // Main buttons, headers
className="text-blue-600"     // Links, primary text

// SUCCESS (Green)
className="bg-green-500"      // Positive metrics, success states
className="text-green-500"    // Success text

// WARNING (Yellow)
className="bg-yellow-500"     // Moderate alerts, caution
className="text-yellow-500"   // Warning text

// ERROR (Red)
className="bg-red-600"        // Critical alerts, errors
className="text-red-600"      // Error text
```

---

## 📊 Thesis Objectives → Implementation

| Objective | Location | Key Function |
|-----------|----------|--------------|
| **Obj 1:** Analytics Dashboard | `/analytics` | `getTourismKPIs()` |
| **Obj 2:** Predictive Modeling | `/admin` | `getForecast()` |
| **Obj 3:** Report Generation | `/admin` button | `generateReport()` |

---

## 🔗 Subsystem Integration

```javascript
// All teams call this function:
import { addPoints } from '@/lib/rewards';

await addPoints(
  userId,              // User UUID from profiles
  50,                  // Points to award
  'museum_qr_scan'     // Your subsystem identifier
);

// Team 10 automatically aggregates this data
```

---

## 📁 File Structure Quick Map

```
src/
├── lib/
│   ├── analytics.js     ← Main analytics functions
│   ├── rewards.js       ← Integration hook
│   └── supabaseClient.js
│
├── app/
│   ├── (subsystems)/
│   │   ├── analytics/   ← Public dashboard
│   │   │   └── page.js
│   │   └── admin/       ← Admin dashboard
│   │       └── page.js
│   └── page.js          ← Landing page
│
└── components/
    └── ui/
        ├── KPICard.js
        ├── SubsystemBreakdown.js
        └── TimeSeriesChart.js
```

---

## 🎯 Key Functions Reference

```javascript
// Get all KPIs (Objective 1)
const kpis = await getTourismKPIs();
// Returns: { totalRevenue, visitorCount, jobsCreated, 
//            totalTransactions, subsystemBreakdown }

// Calculate sustainability (Thesis requirement)
const score = await calculateSustainabilityScore();
// Returns: 0-100 (Green≥80, Yellow≥60, Red<60)

// Get forecast (Objective 2)
const forecast = await getForecast();
// Returns: { predictedRevenue, predictedVisitors, 
//            predictedResourceStrain, confidence, trend }

// Get time series data
const data = await getTimeSeriesData('week');
// Options: 'week', 'month', 'year'
```

---

## 🌈 Sustainability Score Guide

| Score | Color | Class | Meaning |
|-------|-------|-------|---------|
| 80-100 | 🟢 Green | `text-green-500` | Excellent |
| 60-79 | 🟡 Yellow | `text-yellow-500` | Good |
| 0-59 | 🔴 Red | `text-red-600` | Needs Improvement |

---

## 📄 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview & setup |
| `INSTALLATION.md` | Step-by-step installation |
| `DEVELOPER_GUIDE.md` | Integration guide for other teams |
| `THESIS_ALIGNMENT.md` | Complete thesis-to-code mapping |
| `COLOR_CODING_GUIDE.md` | Design standards reference |
| `IPO_FRAMEWORK_MAPPING.md` | Technical INPUT-PROCESS-OUTPUT |
| `IMPLEMENTATION_SUMMARY.md` | Overview of all changes |

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📊 Database Tables

```sql
-- Core tables for Team 10
profiles (id, full_name, points, user_type)
reward_history (id, user_id, subsystem_source, points_earned, created_at)
```

---

## 🎨 UI Component Standards

```javascript
// Cards
className="rounded-2xl shadow-lg"

// Buttons (Primary)
className="bg-blue-600 hover:bg-blue-700 rounded-full"

// Touch targets
style={{ minHeight: '44px', minWidth: '44px' }}

// Breakpoints
Mobile: 375px
Tablet: 768px
Desktop: 1024px
```

---

## ⚠️ Common Gotchas

1. **Always use `bg-blue-600`** for primary, not `bg-blue-500`
2. **Success is `green-500`**, not `green-600`
3. **Error is `red-600`**, not `red-500`
4. **Add icons** to all color-coded states (accessibility)
5. **Mobile-first** - design for 375px first

---

## 📞 Quick Help

**Stuck on integration?** → Read `DEVELOPER_GUIDE.md`  
**Need thesis reference?** → Check `THESIS_ALIGNMENT.md`  
**Color confusion?** → See `COLOR_CODING_GUIDE.md`  
**Technical details?** → Review `IPO_FRAMEWORK_MAPPING.md`

---

**Last Updated:** October 20, 2026  
**Team:** 10 (Perillo, Lerum, Rasco)
