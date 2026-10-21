# Developer Guide - Team 10 Analytics System

## For Other Teams: Integrating with the Analytics System

The Tourism Impact Assessment and Data Analytics System (Team 10) aggregates data from all 11 subsystems. Here's how your team integrates with our system.

### The Rewards Hook - Your Integration Point

Every time a user completes a meaningful action in your subsystem, you should award them points. This creates a transaction record that Team 10 uses for analytics.

#### How to Award Points

```javascript
import { addPoints } from '@/lib/rewards';

// In your component or API route
const handleUserAction = async (userId) => {
  const result = await addPoints(
    userId,              // UUID from profiles table
    50,                  // Points to award (customize based on action)
    'your_subsystem'     // Your subsystem identifier
  );
  
  if (result.success) {
    // Points awarded successfully
    console.log('User rewarded!');
  } else {
    // Handle error
    console.error('Reward failed:', result.error);
  }
};
```

### Subsystem Source Identifiers

Use these standardized identifiers for the `subsystem_source` parameter:

| Team | Subsystem | Identifier |
|------|-----------|------------|
| 1 | Tourist Information | `info_query` |
| 2 | Workflow Management | `workflow_action` |
| 3 | Museum System | `museum_qr_scan` |
| 4 | Local Experiences | `experience_booking` |
| 5 | Tourism Programs | `program_enrollment` |
| 6 | Crisis Management | `crisis_report` |
| 7 | E-commerce Shop | `shop_purchase` |
| 8 | Tour Bookings | `tour_booking` |
| 9 | Feedback System | `feedback_submission` |
| 10 | Analytics | `analytics_view` |
| 11 | Rewards System | `reward_claim` |

### Recommended Point Values

These are suggestions - adjust based on your subsystem's needs:

- **Low engagement actions** (view, search): 10-20 points
- **Medium engagement** (form submission, booking): 50-100 points
- **High engagement** (purchase, completion): 100-200 points
- **Premium actions** (review, referral): 200-500 points

### Example Integrations

#### Team 3: Museum QR Code Scanner

```javascript
// In your QR scanner component
import { addPoints } from '@/lib/rewards';

const handleQRScan = async (artifactId, userId) => {
  // 1. Log the scan in your museum_scans table
  const { error: scanError } = await supabase
    .from('museum_scans')
    .insert({
      user_id: userId,
      artifact_id: artifactId,
    });

  if (scanError) {
    console.error('Failed to log scan');
    return;
  }

  // 2. Award points for the scan
  await addPoints(userId, 50, 'museum_qr_scan');

  // 3. Update your UI
  showSuccessMessage('Artifact scanned! +50 points');
};
```

#### Team 7: E-commerce Purchase

```javascript
// In your checkout flow
import { addPoints } from '@/lib/rewards';

const completePurchase = async (orderId, userId, totalAmount) => {
  // 1. Process the payment and create order
  const { error: orderError } = await supabase
    .from('shop_orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status: 'completed',
    });

  if (orderError) {
    console.error('Order failed');
    return;
  }

  // 2. Award points based on purchase amount (1 point per ₱10 spent)
  const pointsToAward = Math.floor(totalAmount / 10);
  await addPoints(userId, pointsToAward, 'shop_purchase');

  // 3. Show confirmation
  showSuccessMessage(`Purchase complete! +${pointsToAward} points`);
};
```

#### Team 8: Tour Booking

```javascript
// In your booking confirmation
import { addPoints } from '@/lib/rewards';

const confirmTourBooking = async (bookingId, userId) => {
  // 1. Update booking status
  const { error: bookingError } = await supabase
    .from('tours_bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId);

  if (bookingError) {
    console.error('Booking confirmation failed');
    return;
  }

  // 2. Award points for booking
  await addPoints(userId, 100, 'tour_booking');

  // 3. Send confirmation email/notification
  sendBookingConfirmation(bookingId);
};
```

### Testing Your Integration

1. **Create a test user** in Supabase Auth
2. **Get the user's UUID** from the `profiles` table
3. **Call `addPoints()`** with the test user's ID
4. **Check the analytics dashboard** at `/analytics` to see your transaction appear

### Common Pitfalls

❌ **Don't award points multiple times for the same action**
```javascript
// BAD: This could award points twice
const handleClick = async () => {
  await addPoints(userId, 50, 'action');
  await addPoints(userId, 50, 'action'); // Duplicate!
};
```

✅ **Do check for completion before awarding**
```javascript
// GOOD: Only award once action is truly complete
const handleClick = async () => {
  const completed = await performAction();
  if (completed) {
    await addPoints(userId, 50, 'action');
  }
};
```

❌ **Don't use hardcoded user IDs**
```javascript
// BAD: Never hardcode UUIDs
await addPoints('00000000-0000-0000-0000-000000000001', 50, 'action');
```

✅ **Do get the user ID from authentication**
```javascript
// GOOD: Use current authenticated user
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  await addPoints(user.id, 50, 'action');
}
```

### Database Schema You Need to Know

#### The `profiles` table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,           -- User's UUID from auth.users
  full_name TEXT,
  points INTEGER DEFAULT 0,      -- Total accumulated points
  user_type TEXT                 -- 'tourist', 'artisan', 'operator', 'admin'
);
```

#### The `reward_history` table (Team 10 reads from this)
```sql
CREATE TABLE reward_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  subsystem_source TEXT,         -- Your subsystem identifier
  points_earned INTEGER,         -- Points for this action
  created_at TIMESTAMP           -- Auto-populated
);
```

### Need Help?

- Check the `/analytics` dashboard to verify your transactions are appearing
- Review `src/lib/rewards.js` for the implementation details
- Contact Team 10 via Facebook Messenger if you encounter issues

### Advanced: Reading Analytics Data

If your subsystem needs to display analytics (e.g., "Your team generated X revenue this month"), you can import the analytics functions:

```javascript
import { getTourismKPIs, getTimeSeriesData } from '@/lib/analytics';

const showMySubsystemStats = async () => {
  const kpis = await getTourismKPIs();
  const myTransactions = kpis.subsystemBreakdown['your_subsystem'] || 0;
  console.log(`Your subsystem had ${myTransactions} transactions`);
};
```

---

**Happy integrating! Let's build the future of Daet Tourism together. 🚀**
