const express = require("express");
const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwt");
const db = require("../db");
const { users } = require("../db/schema/users.schema");
const { eq } = require("drizzle-orm");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, mobile_number } = req.body;

    // 1 Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        status: "error",
        message: "Email, password and name are required",
      });
    }

    // 2 Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "User already exists",
      });
    }

    // 3️ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4 Insert user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        mobileNumber: mobile_number,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        mobile_number: users.mobileNumber,
      });

    // 5 Create JWT
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // 6 Send response (MATCHES FRONTEND EXPECTATION)
    return res.status(201).json({
      status: "success",
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1 Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // 2 Find user by email
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        passwordHash: users.passwordHash,
        mobile_number: users.mobileNumber,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // 3️ Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // 4️ Generate JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    // 5️ Remove password before sending response
    delete user.passwordHash;

    // 6️ Send response (same shape as signup)
    return res.json({
      status: "success",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
