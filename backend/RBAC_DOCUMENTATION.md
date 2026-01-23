# RBAC (Role-Based Access Control) Implementation

## Overview
This system implements fine-grained Role-Based Access Control across all API endpoints. There are 3 roles with hierarchical permissions.

## Roles & Permissions

### 1. **OWNER** (Full Access)
- ✅ Create, read, update, delete all resources
- ✅ Manage user invitations and roles
- ✅ Delete categories and budget items
- ✅ Delete events, notes, guests
- ✅ Edit profile
- **Best for:** Wedding organizer/planner

### 2. **EDITOR** (Create & Edit)
- ✅ Create and edit budget items, categories
- ✅ Add and edit guests, update RSVP
- ✅ Create and edit events
- ✅ Create and edit notes
- ❌ Cannot delete any resources
- ❌ Cannot manage user roles
- **Best for:** Family member helping with planning

### 3. **VIEWER** (Read-Only)
- ✅ View budget, guests, events, notes, profile
- ❌ Cannot create, edit, or delete anything
- **Best for:** Guest or family member who wants to stay informed

---

## Permission Matrix

| Operation | VIEWER | EDITOR | OWNER |
|-----------|--------|--------|-------|
| View Budget | ✅ | ✅ | ✅ |
| Create Budget Item | ❌ | ✅ | ✅ |
| Edit Budget Item | ❌ | ✅ | ✅ |
| Delete Budget Item | ❌ | ❌ | ✅ |
| Create Category | ❌ | ✅ | ✅ |
| Edit Category | ❌ | ✅ | ✅ |
| Delete Category | ❌ | ❌ | ✅ |
| View Guests | ✅ | ✅ | ✅ |
| Add Guest | ❌ | ✅ | ✅ |
| Edit Guest | ❌ | ✅ | ✅ |
| Delete Guest | ❌ | ❌ | ✅ |
| Update RSVP | ❌ | ✅ | ✅ |
| View Events | ✅ | ✅ | ✅ |
| Create Event | ❌ | ✅ | ✅ |
| Edit Event | ❌ | ✅ | ✅ |
| Delete Event | ❌ | ❌ | ✅ |
| View Notes | ✅ | ✅ | ✅ |
| Create Note | ❌ | ✅ | ✅ |
| Edit Note | ❌ | ✅ | ✅ |
| Delete Note | ❌ | ❌ | ✅ |
| View Profile | ✅ | ✅ | ✅ |
| Edit Profile | ❌ | ✅ | ✅ |
| Invite Users | ❌ | ❌ | ✅ |
| Manage Roles | ❌ | ❌ | ✅ |

---

## Implementation Details

### Files Created/Modified:

1. **`rbac.constants.js`** - Role and permission definitions
   - Defines all roles (OWNER, EDITOR, VIEWER)
   - Maps permissions to each role
   - Single source of truth for permissions

2. **`rbac.middleware.js`** - Permission checking middleware
   - `requirePermission(permission)` - Check specific permissions
   - `requireOwnerRole()` - Strict owner-only check
   - `requireEditAccess()` - OWNER or EDITOR check

3. **Updated Routes:**
   - `budget.routes.js` - Budget CRUD with role checks
   - `guest.routes.js` - Guest management with role checks
   - `event.routes.js` - Event management with role checks
   - `noteRoutes.js` - Notes with role checks
   - `profile.routes.js` - Profile with role checks

### How Middleware Works:

All RBAC middleware are **middleware factories** that return middleware functions:

```javascript
// Example: Only editors and owners can add guests
router.post(
  "/", 
  requireEditAccess(),            // Checks if OWNER or EDITOR - CALL AS FUNCTION
  validate(addGuestSchema),       // Validates input
  addGuest                        // Controller
);

// Example: Only owner can delete
router.delete(
  "/:id",
  requireOwnerRole(),             // Checks if OWNER - CALL AS FUNCTION
  budgetController.deleteItem
);

// Example: Check specific permission
router.get(
  "/",
  requirePermission(PERMISSIONS.VIEW_BUDGET),  // Can pass single or array of permissions
  controller
);
```

### Error Responses:

**Insufficient Permissions (403):**
```json
{
  "success": false,
  "message": "Insufficient permissions to perform this action",
  "userRole": "VIEWER",
  "requiredPermissions": ["CREATE_BUDGET_ITEM"]
}
```

---

## Usage Examples

### In Routes:
```javascript
const { requirePermission, requireEditAccess, requireOwnerRole } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");

// View (any authenticated user)
router.get("/", requirePermission(PERMISSIONS.VIEW_BUDGET), controller);

// Create/Edit (EDITOR or OWNER)
router.post("/", requireEditAccess(), controller);  // NOTE: Call as function with ()

// Delete/Admin (OWNER only)
router.delete("/:id", requireOwnerRole(), controller);  // NOTE: Call as function with ()
```

### In Controllers:
No changes needed! The middleware handles all permission checks before the controller is called.

---

## Auth Endpoints with RBAC

### Invitation Code Management (OWNER only):

**Generate New Invitation Code:**
```
POST /api/auth/generate-code
Authorization: Bearer {owner-token}
Content-Type: application/json

Response:
{
  "success": true,
  "data": {
    "code": "ABC12345",
    "expiresAt": "2026-02-22T10:00:00Z",
    "maxUses": 100,
    "usedCount": 0
  }
}
```

**Retrieve Existing Invitation Code:**
```
GET /api/auth/get-invitation-code
Authorization: Bearer {owner-token}

Response:
{
  "success": true,
  "data": {
    "code": "ABC12345",
    "expiresAt": "2026-02-22T10:00:00Z",
    "maxUses": 100,
    "usedCount": 5
  }
}
```

**Join Wedding with Code:**
```
POST /api/auth/join-wedding
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123",
  "invitationCode": "ABC12345",
  "role": "VIEWER"  // Can be VIEWER or EDITOR, OWNER is not allowed
}

Response:
{
  "success": true,
  "data": { "token": "jwt-token" },
  "message": "Successfully joined wedding"
}
```

---

## User Management Endpoints (OWNER only)

**Get All Users in Wedding:**
```
GET /api/users
Authorization: Bearer {owner-token}

Response:
{
  "success": true,
  "data": [
    { "_id": "123", "name": "John", "email": "john@ex.com", "role": "OWNER" },
    { "_id": "456", "name": "Jane", "email": "jane@ex.com", "role": "VIEWER" }
  ]
}
```

**Change User Role:**
```
PATCH /api/users/{userId}/role
Authorization: Bearer {owner-token}
Content-Type: application/json

{ "role": "EDITOR" }
```

**Remove User from Wedding:**
```
DELETE /api/users/{userId}
Authorization: Bearer {owner-token}
```

**Get Current User Permissions:**
```
GET /api/users/me/permissions
Authorization: Bearer {any-user-token}

Response:
{
  "success": true,
  "data": {
    "role": "EDITOR",
    "permissions": ["VIEW_BUDGET", "CREATE_BUDGET_ITEM", ...]
  }
}
```

---

## Frontend Conditional Rendering

**Share Wedding Page (OWNER only):**
- ShareWedding component checks user role on mount
- Redirects non-owners to dashboard
- Only OWNER can see/manage invitation codes
- Persists existing code (doesn't generate new one each visit)
- Only OWNER can view team members list

**Sidebar Navigation:**
- "Share Wedding" link only visible to OWNER users
- Link is conditionally rendered based on role check
- Non-owners cannot access the feature at all

---

## Future Enhancements

1. **User Invitation System**
   - OWNER invites other users to wedding
   - Assign role when inviting
   - Accept/decline invitations

2. **Audit Logging**
   - Track who changed what
   - Log all role changes

3. **Custom Roles**
   - Create custom role combinations
   - Assign per-user permissions

4. **Guest Permissions**
   - Guests can update only their own RSVP
   - Guests can view only public information

---

## Testing RBAC

**Test as VIEWER:**
```bash
# Can view
curl -H "Authorization: Bearer viewer-token" GET /api/budget

# Cannot create
curl -H "Authorization: Bearer viewer-token" POST /api/budget/item # 403 Forbidden
```

**Test as EDITOR:**
```bash
# Can create
curl -H "Authorization: Bearer editor-token" POST /api/budget/item # 201 Created

# Cannot delete
curl -H "Authorization: Bearer editor-token" DELETE /api/budget/item/123 # 403 Forbidden
```

**Test as OWNER:**
```bash
# Can delete
curl -H "Authorization: Bearer owner-token" DELETE /api/budget/item/123 # 200 Success
```
