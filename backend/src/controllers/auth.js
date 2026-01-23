const jwt = require("jsonwebtoken");
const User = require("../models/User")
const Wedding = require("../models/Wedding");
const WeddingInvitation = require("../models/WeddingInvitation");
const { hashPassword, comparePassword } = require("../utils/password.util");


const register = async (req, res) => {
  try {
    const { name, email, password, weddingName } = req.body;

    if (!name || !email || !password || !weddingName) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Name, email, password, and wedding name are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "Email already registered"
      });
    }

    // 1️⃣ Hash password
    const passwordHash = await hashPassword(password);

    // 2️⃣ Create USER FIRST (no weddingId yet)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "OWNER"
    });

    // 3️⃣ Create WEDDING with ownerId
    const wedding = await Wedding.create({
      name: weddingName,
      ownerId: user._id
    });

    // 4️⃣ Link wedding to user
    user.weddingId = wedding._id;
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        weddingId: wedding._id
      },
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid email or password"
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        weddingId: user.weddingId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: { token },
      message: "Login successful"
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Server error"
    });
  }
};

// Join wedding with invitation code
const joinWedding = async (req, res) => {
  try {
    const { name, email, password, invitationCode, role } = req.body;

    if (!name || !email || !password || !invitationCode) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and invitation code are required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Find valid invitation
    const invitation = await WeddingInvitation.findOne({
      invitationCode: invitationCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invitation code"
      });
    }

    // Check max uses
    if (invitation.usedCount >= invitation.maxUses) {
      return res.status(400).json({
        success: false,
        message: "Invitation code has reached max uses"
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with same weddingId
    const user = await User.create({
      name,
      email,
      passwordHash,
      weddingId: invitation.weddingId,
      role: role || "VIEWER" // Default to VIEWER for joined users
    });

    // Update invitation usage
    invitation.usedCount += 1;
    await invitation.save();

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        weddingId: user.weddingId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      data: { 
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      message: "Successfully joined wedding"
    });
  } catch (error) {
    console.error("Join wedding error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Generate invitation code (OWNER only)
const generateInvitationCode = async (req, res) => {
  try {
    const { weddingId } = req.user;
    const { maxUses = 100, expiryDays = 30 } = req.body;

    if (!weddingId) {
      return res.status(400).json({
        success: false,
        message: "Must be part of a wedding to generate codes"
      });
    }

    // Generate unique code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    const invitation = await WeddingInvitation.create({
      weddingId,
      invitationCode: code,
      createdBy: req.user.userId,
      maxUses,
      expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
    });

    res.json({
      success: true,
      data: {
        code: invitation.invitationCode,
        expiresAt: invitation.expiresAt,
        maxUses: invitation.maxUses,
        usedCount: 0
      },
      message: "Invitation code generated"
    });
  } catch (error) {
    console.error("Generate code error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get existing invitation code (OWNER only)
const getInvitationCode = async (req, res) => {
  try {
    const { weddingId } = req.user;

    if (!weddingId) {
      return res.status(400).json({
        success: false,
        message: "Must be part of a wedding"
      });
    }

    // Get most recent active invitation code
    const invitation = await WeddingInvitation.findOne({
      weddingId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!invitation) {
      return res.json({
        success: true,
        data: { code: null },
        message: "No active invitation code"
      });
    }

    res.json({
      success: true,
      data: {
        code: invitation.invitationCode,
        expiresAt: invitation.expiresAt,
        maxUses: invitation.maxUses,
        usedCount: invitation.usedCount
      },
      message: "Invitation code retrieved"
    });
  } catch (error) {
    console.error("Get code error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { register, login, joinWedding, generateInvitationCode, getInvitationCode };
