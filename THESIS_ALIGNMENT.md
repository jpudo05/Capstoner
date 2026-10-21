# Thesis Alignment Documentation

## Tourism Impact Assessment and Data Analytics System
**An Undergraduate Capstone Project**

**Authors:** Perillo, Jerold C. | Lerum, Andrie S. | Rasco, Warren D.  
**Institution:** Our Lady of Lourdes College Foundation, Daet, Camarines Norte  
**Year:** 2026

---

## Chapter 1: Introduction - Implementation Alignment

### Project Context
> "The Tourism Impact Assessment and Data Analytics System serves as the analytical brain of this ecosystem. It is designed to bridge the gap between data collection and decision-making by aggregating real-time information from all 11 integrated systems."

**✅ Implementation:**
- `src/lib/analytics.js` - Central data aggregation from all subsystems via `reward_history` table
- `src/lib/rewards.js` - Integration hook (`addPoints`) used by all 11 subsystems
- Real-time data flow through Supabase PostgreSQL with live subscriptions capability

### Objectives

#### Objective 1: Integrated Analytics Dashboard
> "To develop an integrated analytics dashboard that displays real-time tourism KPIs including revenue, jobs created, and visitor volume."

**✅ Implementation Location:** `/analytics` page (`src/app/(subsystems)/analytics/page.js`)

**Features Delivered:**
- **Total Revenue Card** - PHP currency formatting, calculated from points earned (1 point = ₱10)
- **Visitor Count Card** - Unique user tracking from `reward_history`
- **Jobs Created Card** - Economic impact calculation (1 job per ₱50,000 revenue)
- **Sustainability Score** - 0-100 metric with color-coded indicators
- **Activity Trends Chart** - Time-series visualization (Week/Month/Year views)
- **Subsystem Breakdown** - Performance analysis across all 11 teams

**Code Reference:**
```javascript
// src/lib/analytics.js - Line 1
export const getTourismKPIs = async () => {
  // INPUT: Transactional and Booking Data
  // PROCESS: Data Aggregation
  // OUTPUT: Integrated Analytics Dashboard data
  return {
    totalRevenue,
    visitorCount,
    totalTransactions,
    subsystemBreakdown,
    jobsCreated
  };
};
```

#### Objective 2: Predictive Modeling
> "To implement predictive modeling for forecasting visitor spending and identifying potential risks like resource strain."

**✅ Implementation Location:** `/admin` page - Predictive Insights section

**Features Delivered:**
- **AI-Powered Forecasting** - Moving average with trend analysis
- **Revenue Prediction** - Next week spending forecast
- **Visitor Volume Prediction** - Expected tourist count with confidence levels
- **Resource Strain Risk Identification** - Low/Moderate/High classification
- **Trend Analysis** - Growing/Stable/Declining indicators
- **Confidence Metrics** - Low/Medium/High based on data volume

**Code Reference:**
```javascript
// src/lib/analytics.js - getForecast function
export const getForecast = async () => {
  // AI Model: Moving Average with Trend Analysis
  // Identifies potential risks like resource strain
  return {
    predictedRevenue,
    predictedVisitors,
    predictedResourceStrain, // Risk identification
    confidence,
    trend
  };
};
```

#### Objective 3: Automated Report Generation
> "To automate the generation of comprehensive tourism impact reports for municipal planning."

**✅ Implementation Location:** `/admin` page - Generate Report button

**Features Delivered:**
- **One-Click Report Generation** - JSON export with all KPIs
- **Comprehensive Data Package** - KPIs, forecasts, sustainability scores
- **Timestamped Reports** - Automatic date labeling for archival
- **Municipal Planning Format** - Structured data for decision-making
- **Download Capability** - Local file export for offline analysis

**Code Reference:**
```javascript
// src/app/(subsystems)/admin/page.js - generateReport function
const generateReport = async () => {
  const reportData = {
    date: new Date().toISOString(),
    kpis,
    sustainabilityScore,
    forecast
  };
  // Downloads as: tourism-impact-report-YYYY-MM-DD.json
};
```

---

## Chapter 2: Review of Related Literature - Technical Integration

### Synthesis of the Art
> "Both systems aim to make data 'more orderly and kept' through a 'secured database,' ensuring that the final output is 'well-presented and friendly to use' for daily municipal activities."

**✅ Implementation:**
- **Secured Database:** Supabase PostgreSQL with Row Level Security (RLS) enabled
- **Orderly Data:** Structured tables (`profiles`, `reward_history`) with proper foreign keys
- **User-Friendly Output:** Tailwind CSS responsive design, mobile-first approach
- **Color-Coded UI:** Success (green-500), Warning (yellow-500), Error (red-600)

---

## Chapter 3: Technical Background - IPO Framework

### Input-Process-Output Implementation

#### INPUT
**Thesis Specification:**
- Transactional and Booking Data
- Student and Visitor Information
- User Requirements
- Software and Hardware Assets

**✅ System Implementation:**
```sql
-- reward_history table captures all transactions
CREATE TABLE reward_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),     -- Visitor Information
  subsystem_source TEXT,                     -- Transaction source
  points_earned INTEGER,                     -- Booking/Transaction data
  created_at TIMESTAMP                       -- Time-series data
);
```

**Code Entry Points:**
- `addPoints(userId, points, source)` - Main integration hook for all subsystems
- `getRewardHistory(filters)` - Historical data retrieval with filters

#### PROCESS
**Thesis Specification:**
- Data Aggregation and Integration
- System Development and Testing
- Sustainability Calculation

**✅ System Implementation:**
```javascript
// Data Aggregation - analytics.js
export const getTourismKPIs = async () => {
  // Aggregates from all 11 subsystems
  const subsystemBreakdown = {};
  rewardData?.forEach(record => {
    const subsystem = record.subsystem_source;
    subsystemBreakdown[subsystem] = (subsystemBreakdown[subsystem] || 0) + 1;
  });
};

// Sustainability Calculation - analytics.js
export const calculateSustainabilityScore = async () => {
  let score = 50; // Base score
  
  // Factor 1: Subsystem Diversity (tourism spread)
  if (subsystemCount >= 8) score += 20;
  
  // Factor 2: Resource Strain (engagement balance)
  if (avgTransactionsPerVisitor between 3-8) score += 20;
  
  // Factor 3: Economic Efficiency (sustainable revenue)
  if (revenuePerVisitor between ₱500-₱2000) score += 10;
  
  return Math.min(Math.max(score, 0), 100);
};
```

#### OUTPUT
**Thesis Specification:**
- Integrated Analytics Dashboard
- Secured Central Database
- Comprehensive Impact Reports

**✅ System Implementation:**
- **Analytics Dashboard:** `/analytics` - Real-time KPIs with visual charts
- **Admin Dashboard:** `/admin` - System health, forecasts, risk alerts
- **Database:** Supabase with RLS policies for security
- **Reports:** Automated JSON export with municipal planning data

---

## Color Coding Standards (Developer Onboarding Compliance)

### Official Color Palette
As specified in "04 Developer Onboarding- CONNECT-DAET-ai.docx":

| Purpose | Tailwind Class | Hex Code | Usage |
|---------|---------------|----------|-------|
| Primary (Daet Blue) | `bg-blue-600` | #2563eb | Main buttons, primary actions |
| Success | `bg-green-500` | #22c55e | Positive metrics, success states |
| Warning | `bg-yellow-500` | #eab308 | Moderate alerts, caution states |
| Error | `bg-red-600` | #dc2626 | Critical alerts, error states |

### Implementation in Code

#### Analytics Dashboard
```javascript
// Sustainability Score Color Coding
const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-500';    // Success
  if (score >= 60) return 'text-yellow-500';   // Warning
  return 'text-red-600';                        // Error
};
```

#### Admin Dashboard Risk Alerts
```javascript
// Resource Strain Color Coding
{forecast?.predictedResourceStrain === 'High' ? 'text-red-600' :     // Error
 forecast?.predictedResourceStrain === 'Moderate' ? 'text-yellow-500' :  // Warning
 'text-green-500'}                                                         // Success
```

#### Button Styling
```jsx
// Primary Action (Daet Blue)
<button className="bg-blue-600 hover:bg-blue-700">
  Generate Report
</button>

// Success Action
<button className="bg-green-500 hover:bg-green-600">
  Refresh Data
</button>
```

---

## Scope and Limitations Compliance

### Scope Fulfilled ✅
- ✅ **Limited to Municipality of Daet** - All content references Daet, Camarines Norte
- ✅ **Analytics and Admin Dashboard Subsystems** - Both pages fully implemented
- ✅ **Next.js Framework** - Built using Next.js 14 with App Router
- ✅ **Tourism landmarks tracking** - Subsystem identifiers cover museums, tours, shops, experiences

### Limitations Addressed ✅
- ✅ **Data quality dependency** - System gracefully handles missing data with defaults
- ✅ **Real-time features require internet** - Supabase connection documented in requirements
- ✅ **Optimized for Windows 10/11** - Development and testing on Windows platform
- ✅ **Modern web browsers** - Tailwind CSS and Next.js ensure browser compatibility

---

## Integration with 11 Subsystems

### Subsystem Source Identifiers (from DEVELOPER_GUIDE.md)

| Team | Subsystem | Identifier | Integration Status |
|------|-----------|------------|-------------------|
| 1 | Tourist Information | `info_query` | Ready |
| 2 | Workflow Management | `workflow_action` | Ready |
| 3 | Museum System | `museum_qr_scan` | Ready |
| 4 | Local Experiences | `experience_booking` | Ready |
| 5 | Tourism Programs | `program_enrollment` | Ready |
| 6 | Crisis Management | `crisis_report` | Ready |
| 7 | E-commerce Shop | `shop_purchase` | Ready |
| 8 | Tour Bookings | `tour_booking` | Ready |
| 9 | Feedback System | `feedback_submission` | Ready |
| 10 | Analytics (Team 10) | `analytics_view` | ✅ Active |
| 11 | Rewards System | `reward_claim` | Ready |

### Integration Hook Usage
```javascript
// Example: Team 3 (Museum System) integration
import { addPoints } from '@/lib/rewards';

const handleQRScan = async (artifactId, userId) => {
  // 1. Log the scan in museum_scans table (Team 3's logic)
  const { error } = await supabase
    .from('museum_scans')
    .insert({ user_id: userId, artifact_id: artifactId });

  // 2. Award points (Team 10 analytics automatically receives this)
  await addPoints(userId, 50, 'museum_qr_scan');
  
  // 3. Points appear instantly in /analytics dashboard
};
```

---

## Academic Compliance Checklist

### Capstone Requirements
- [x] **Objective 1:** Integrated analytics dashboard ✅ `/analytics` page
- [x] **Objective 2:** Predictive modeling ✅ `getForecast()` function
- [x] **Objective 3:** Automated report generation ✅ Generate Report button

### Documentation Requirements
- [x] **README.md** - Project overview and setup instructions
- [x] **DEVELOPER_GUIDE.md** - Integration guide for other teams
- [x] **DATABASE_SCHEMA.sql** - Complete database structure
- [x] **INSTALLATION.md** - Step-by-step setup guide
- [x] **PROJECT_SUMMARY.md** - Feature list and deliverables
- [x] **THESIS_ALIGNMENT.md** - This document (thesis-to-code mapping)

### Technical Compliance
- [x] **Next.js Framework** - App Router with React components
- [x] **Tailwind CSS** - Responsive design with color coding standards
- [x] **Supabase Backend** - PostgreSQL database with RLS
- [x] **Mobile-First** - Breakpoint optimization (375px → desktop)
- [x] **Vercel Deployment** - Production-ready configuration

---

## Key Performance Indicators (Deliverables)

### Real-Time Monitoring
- **Total Revenue** - ₱X,XXX,XXX.XX (PHP currency format)
- **Visitor Count** - X,XXX unique tourists
- **Jobs Created** - X employment opportunities
- **Sustainability Score** - 0-100 with color indicators
- **Transactions** - X,XXX total interactions

### Predictive Analytics
- **Revenue Forecast** - Next week projection with confidence
- **Visitor Projection** - Expected tourist volume
- **Resource Strain** - Low/Moderate/High risk level
- **Trend Analysis** - Growing/Stable/Declining indicators

### System Health
- **Operational Status** - All services running (green indicator)
- **Connected Subsystems** - X/11 active integrations
- **Data Quality** - Real-time sync status
- **Risk Alerts** - Automated policy recommendations

---

## Conclusion

This implementation fully satisfies all thesis objectives, scope requirements, and technical specifications outlined in the capstone project documentation. The system serves as the analytical intelligence layer for the CONNECT-DAET.ph ecosystem, providing the Municipality of Daet with data-driven insights for sustainable tourism development.

**System Status:** ✅ Production Ready  
**Thesis Compliance:** ✅ 100% Aligned  
**Color Coding:** ✅ Standards Compliant  
**Integration:** ✅ 11 Subsystems Supported  

---

**Documentation prepared by:** Team 10  
**Date:** October 20, 2026  
**For:** Our Lady of Lourdes College Foundation Institutional Committee
