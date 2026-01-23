const { ROLE_PERMISSIONS } = require('../utils/rbac.constants');

/**
 * Middleware factory to check if user has required permission
 * @param {string|array} requiredPermissions - Single permission or array of permissions
 * @returns {function} Middleware function
 */
const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Get user from auth middleware
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user's role
      const userRole = user.role;
      
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'User role not assigned'
        });
      }

      // Get permissions for user's role
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      // Check if permission is array or string
      const permissionsToCheck = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Check if user has at least one required permission (OR logic)
      const hasPermission = permissionsToCheck.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to perform this action',
          userRole,
          requiredPermissions: permissionsToCheck
        });
      }

      // Pass to next middleware
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Middleware to check if user is OWNER (strict ownership check)
 * Used when only owner can perform action
 */
const requireOwnerRole = () => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (user.role !== 'OWNER') {
        return res.status(403).json({
          success: false,
          message: 'Only OWNER can perform this action',
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      console.error('Owner check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Role check failed'
      });
    }
  };
};

/**
 * Middleware to check if user is OWNER or EDITOR
 * Used for edit operations
 */
const requireEditAccess = () => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (user.role !== 'OWNER' && user.role !== 'EDITOR') {
        return res.status(403).json({
          success: false,
          message: 'Edit access required (OWNER or EDITOR)',
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      console.error('Edit access check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Access check failed'
      });
    }
  };
};

module.exports = {
  requirePermission,
  requireOwnerRole,
  requireEditAccess
};
