const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.userId;
    const updates = req.body;
    
    console.log('Profile update request:', { userId, updates });
    
    // Remove sensitive fields
    delete updates.passwordHash;
    delete updates.role;
    delete updates._id;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log('Profile updated successfully:', user);
    res.json({
      success: true,
      data: user,
      error: null,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};