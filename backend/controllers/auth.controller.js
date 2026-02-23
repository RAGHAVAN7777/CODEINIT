import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//
// 🟢 REGISTER
//
export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (email) email = email.trim().toLowerCase();

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check valid role
    if (!["student", "faculty"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash: hashed,
      role
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        classes: user.classes
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 LOGIN
//
export const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    if (email) email = email.trim().toLowerCase();

    console.log(`🔑 Login attempt for: ${email} as ${role}`);

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check role match
    if (user.role !== role) {
      console.log(`❌ Role mismatch for ${email}: Expected ${role}, got ${user.role}`);
      return res.status(403).json({
        success: false,
        message: `Access denied: You are registered as a ${user.role}, not a ${role}.`
      });
    }

    console.log(`✅ User found and role matches: ${user.email} (Role: ${user.role})`);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        classes: user.classes
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
