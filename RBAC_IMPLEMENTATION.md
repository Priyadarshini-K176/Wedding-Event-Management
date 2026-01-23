# RBAC Implementation Summary

## What Was Implemented

### 1. **Role-Based Access Control System**
Three tiers of access with hierarchical permissions:
- **OWNER**: Full access (create, read, update, delete, manage users)
- **EDITOR**: Can create/edit but not delete (no user management)
- **VIEWER**: Read-only access

### 2. **Files Created**

#### Backend Files:
1. **`src/utils/rbac.constants.js`**
   - Defines 3 roles (OWNER, EDITOR, VIEWER)
   - Maps 25+ permissions to each role
   - Single source of truth for all role definitions

2. **`src/middlewares/rbac.middleware.js`**
   - `requirePermission(permission)` - Check specific permissions
   - `requireOwnerRole()` - Restrict to OWNER only
   - `requireEditAccess()` - Allow OWNER or EDITOR
   - Consistent error handling and messaging

3. **`src/controllers/user.controller.js`**
   - `getWeddingUsers()` - List all users in wedding
   - `changeUserRole()` - Change user role (OWNER only)
   - `removeUserFromWedding()` - Remove user access
   - `getUserPermissions()` - Get current user's permissions
   - Built-in safeguards (prevent removing last OWNER, etc.)

4. **`src/routes/user.routes.js`**
   - 4 endpoints for user management
   - All protected with appropriate RBAC checks
   - Includes rate limiting and validation

5. **`RBAC_DOCUMENTATION.md`**
   - Complete permission matrix
   - Usage examples
   - Testing guide
   - Future enhancement suggestions

### 3. **Routes Updated with RBAC**

All API routes now include permission checks:

#### Budget Routes (`budget.routes.js`)
- `GET /overview` → VIEW_BUDGET (all)
- `POST /category` → requireEditAccess
- `POST /item` → requireEditAccess
- `PATCH /item/:id` → requireEditAccess
- `DELETE /item/:id` → requireOwnerRole
- `PATCH /category/:id` → requireEditAccess
- `DELETE /category/:id` → requireOwnerRole

#### Guest Routes (`guest.routes.js`)
- `GET /` → VIEW_GUESTS (all)
- `POST /` → requireEditAccess
- `PATCH /:id/rsvp` → requireEditAccess

#### Event Routes (`event.routes.js`)
- `GET /` → VIEW_EVENTS (all)
- `POST /` → requireEditAccess
- `PUT /:id` → requireEditAccess
- `DELETE /:id` → requireOwnerRole

#### Notes Routes (`noteRoutes.js`)
- `GET /` → VIEW_NOTES (all)
- `POST /` → requireEditAccess
- `DELETE /:id` → requireOwnerRole

#### Profile Routes (`profile.routes.js`)
- `GET /` → VIEW_PROFILE (all)
- `PUT /` → requireEditAccess

#### User Management Routes (`user.routes.js`) - NEW
- `GET /me/permissions` → Check current user's permissions
- `GET /` → getWeddingUsers (OWNER only)
- `PATCH /:userId/role` → changeUserRole (OWNER only)
- `DELETE /:userId` → removeUserFromWedding (OWNER only)

---

## Permission Matrix

| Resource | VIEW | CREATE | EDIT | DELETE | MANAGE |
|----------|------|--------|------|--------|--------|
| Budget | All | EDITOR+ | EDITOR+ | OWNER | OWNER |
| Guests | All | EDITOR+ | EDITOR+ | OWNER | OWNER |
| Events | All | EDITOR+ | EDITOR+ | OWNER | OWNER |
| Notes | All | EDITOR+ | EDITOR+ | OWNER | OWNER |
| Users | OWNER | - | OWNER | OWNER | OWNER |

Legend: All = VIEWER/EDITOR/OWNER, EDITOR+ = EDITOR/OWNER, OWNER = OWNER only

---

## Error Responses

### 403 Forbidden (Insufficient Permission)
```json
{
  "success": false,
  "message": "Insufficient permissions to perform this action",
  "userRole": "VIEWER",
  "requiredPermissions": ["CREATE_BUDGET_ITEM"]
}
```

### 401 Unauthorized (Not Authenticated)
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 400 Bad Request (Invalid Role)
```json
{
  "success": false,
  "message": "Invalid role. Must be one of: OWNER, EDITOR, VIEWER"
}
```

---

## How to Use

### In Code:
```javascript
// Allow specific permission
router.post("/item", 
  requirePermission(PERMISSIONS.CREATE_BUDGET_ITEM), 
  controller
);

// Allow OWNER or EDITOR
router.post("/item", 
  requireEditAccess, 
  controller
);

// OWNER only
router.delete("/item/:id", 
  requireOwnerRole, 
  controller
);
```

### Test with cURL:
```bash
# Check permissions
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/users/me/permissions

# Try to create item as VIEWER (will fail)
curl -X POST -H "Authorization: Bearer $VIEWER_TOKEN" \
  http://localhost:3001/api/budget/item \
  -d '{"name":"test","plannedCost":100}'

# Create item as EDITOR (will succeed)
curl -X POST -H "Authorization: Bearer $EDITOR_TOKEN" \
  http://localhost:3001/api/budget/item \
  -d '{"name":"test","plannedCost":100}'
```

---

## Key Features

✅ **Hierarchical Permissions** - OWNER > EDITOR > VIEWER
✅ **Granular Control** - 25+ distinct permissions
✅ **Consistent Error Handling** - Clear error messages
✅ **Built-in Safeguards** - Can't remove last owner
✅ **Extensible Design** - Easy to add new permissions
✅ **Rate Limiting** - All routes protected
✅ **Input Validation** - All endpoints validate data

---

## Next Steps

1. **Test the system** with different user roles
2. **Create user invitation flow** (future enhancement)
3. **Add audit logging** to track role changes
4. **Implement guest-specific permissions** (guests can only update their RSVP)
5. **Add frontend permission checks** (hide buttons based on role)

---

## Database Notes

The User model already has a `role` field with enum values:
```javascript
role: {
  type: String,
  enum: ["OWNER", "VIEWER", "EDITOR"],
  default: "OWNER"
}
```

No database migration needed - system works with existing schema!
