# Simplified RBAC with Role Selection - Implementation Summary

## What Was Implemented

### Backend Changes

#### 1. **New Model: WeddingInvitation**
- `models/WeddingInvitation.js`
- Stores invitation codes with expiry and usage limits
- Links to wedding and creator
- Tracks how many times code is used

#### 2. **Updated Auth Controller**
- `controllers/auth.js` - Added 2 new functions:

**a) `joinWedding`** - Users can join with invitation code
```javascript
POST /api/auth/join-wedding
{
  "name": "John",
  "email": "john@example.com",
  "password": "Pass123",
  "invitationCode": "WEDDING2024",
  "role": "VIEWER" // User selects this
}
```

**b) `generateInvitationCode`** - Owner generates shareable codes
```javascript
POST /api/auth/generate-code
Authorization: Bearer {owner_token}
{
  "maxUses": 100,
  "expiryDays": 30
}
Response: { "code": "WEDDING2024" }
```

#### 3. **Updated Auth Routes**
- Added 2 new endpoints
- Rate limiting on both
- No additional validation needed (kept simple)

---

### Frontend Changes

#### 1. **SignupFlow Component** - `components/SignupFlow.jsx`
Three-step registration flow:

**Step 1: Choice**
```
┌──────────────────────────────────┐
│ [🎉 Create New Wedding] [👥 Join] │
└──────────────────────────────────┘
```

**Step 2a: Create Wedding** (if user is organizer)
```
Name: _________________
Email: ________________
Password: _____________
Wedding Name: _________
```
→ Becomes OWNER automatically

**Step 2b: Join Wedding** (if user has invitation)
```
Name: _________________
Email: ________________
Password: _____________
Invitation Code: ______
Role: [VIEWER ▼]
      [EDITOR ▼]
```
→ User selects their role

#### 2. **ShareWedding Component** - `components/ShareWedding.jsx`
For OWNER to generate and share codes:
```
[🔗 Generate Invitation Code]
→ Shows: WEDDING2024
→ Copy button
→ Shows role descriptions
→ Can generate new codes
```

#### 3. **Updated Styles**
- `styles/auth.css` - Added signup flow styling
- `styles/invitations-simple.css` - Share wedding styling

---

## How It Works

### Flow 1: Create New Wedding
```
User clicks "Create Wedding"
        ↓
Enters name, email, password, wedding name
        ↓
Registers → Becomes OWNER
        ↓
Dashboard opens with "Share Wedding" button
```

### Flow 2: Join Existing Wedding
```
User clicks "Join Wedding"
        ↓
Enters name, email, password, invitation code
        ↓
Selects role: VIEWER or EDITOR
        ↓
Joins same weddingId as organizer
        ↓
Dashboard with limited permissions
```

### Flow 3: Owner Shares Code
```
Owner visits ShareWedding component
        ↓
Clicks "Generate Invitation Code"
        ↓
Gets: WEDDING2024 (valid 30 days, 100 uses max)
        ↓
Shares code with friends/family
        ↓
They use code to join with chosen role
```

---

## Role Selection

### VIEWER Role
- Can view all data
- Cannot create, edit, or delete
- Choosing this shows: "👁️ View only (no edits)"

### EDITOR Role
- Can create and edit items
- Cannot delete items
- Choosing this shows: "✏️ Create & edit (no delete)"

### OWNER Role
- Not available on join - only when registering
- Full access to everything
- Can share codes and manage users

---

## Backend Endpoints

### Authentication
```bash
# Register (creates OWNER)
POST /api/auth/register
{ "name", "email", "password", "weddingName" }
→ { "token", "userId", "weddingId" }

# Login
POST /api/auth/login
{ "email", "password" }
→ { "token" }

# Join with code (new)
POST /api/auth/join-wedding
{ "name", "email", "password", "invitationCode", "role" }
→ { "token", "user" }

# Generate code (new)
POST /api/auth/generate-code
Authorization: Bearer {token}
{ "maxUses", "expiryDays" }
→ { "code", "expiresAt", "maxUses" }
```

---

## Database Schema

### Users
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  role: "OWNER" | "EDITOR" | "VIEWER", // Enum
  weddingId: ObjectId // Links to Wedding
}
```

### Weddings
```javascript
{
  name: String,
  ownerId: ObjectId, // Who created it
  totalBudget: Number
}
```

### WeddingInvitations (NEW)
```javascript
{
  weddingId: ObjectId,
  invitationCode: String, // e.g., "WEDDING2024"
  createdBy: ObjectId,
  expiresAt: Date,
  maxUses: Number,
  usedCount: Number,
  isActive: Boolean
}
```

---

## Component Structure

### Frontend Pages
- `SignupFlow.jsx` - Main registration with choice
- `ShareWedding.jsx` - Owner can generate codes

### Imports in App.jsx
```javascript
import SignupFlow from './components/SignupFlow';
import ShareWedding from './components/ShareWedding';

// Route for signup
<Route path="/signup" element={<SignupFlow />} />

// Route for sharing (protected, OWNER only)
<Route path="/share-wedding" element={<ShareWedding />} />
```

---

## Testing the System

### Test 1: Create Wedding
```bash
1. Go to /signup
2. Select "Create New Wedding"
3. Fill form and submit
4. Should login automatically
5. See "Share Wedding" button in dashboard
```

### Test 2: Generate Code
```bash
1. As OWNER, click "Share Wedding"
2. Click "Generate Invitation Code"
3. Get code like "ABC12345"
4. Copy code
```

### Test 3: Join Wedding
```bash
1. Go to /signup
2. Select "Join Wedding"
3. Enter code from Test 2
4. Select role (VIEWER or EDITOR)
5. Should join same wedding as OWNER
6. Permissions enforced by RBAC middleware
```

### Test 4: Check Permissions
```bash
# As VIEWER trying to create item
POST /api/budget/item
Authorization: Bearer {viewer_token}
→ 403 Forbidden - Insufficient permissions

# As EDITOR creating item
POST /api/budget/item
Authorization: Bearer {editor_token}
→ 201 Created - Success
```

---

## Key Features

✅ **Simple 3-step flow** - Choice → Form → Join
✅ **Role selection** - Users pick their access level
✅ **Invitation codes** - Valid 30 days, reusable up to 100 times
✅ **Same wedding** - All users with same code access same data
✅ **RBAC enforced** - Middleware checks permissions on all endpoints
✅ **User-friendly** - Clear descriptions of each role
✅ **Owner controls** - Can generate unlimited codes

---

## Next Steps

1. **Add to App.jsx routes** - SignupFlow, ShareWedding components
2. **Test all flows** - Create, join, permissions
3. **Optional: Revoke codes** - Add DELETE endpoint for codes
4. **Optional: View invitations** - Show all active codes to OWNER

---

## API Testing with cURL

```bash
# Register as OWNER
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah",
    "email": "sarah@wedding.com",
    "password": "Pass123",
    "weddingName": "Sarah & Johns Wedding"
  }'

# Generate code
curl -X POST http://localhost:3001/api/auth/generate-code \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "maxUses": 50, "expiryDays": 30 }'

# Join with code as VIEWER
curl -X POST http://localhost:3001/api/auth/join-wedding \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mom",
    "email": "mom@wedding.com",
    "password": "Pass123",
    "invitationCode": "ABC12345",
    "role": "VIEWER"
  }'
```
