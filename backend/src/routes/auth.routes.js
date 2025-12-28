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

    // 1️⃣ Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        status: "error",
        message: "Email, password and name are required",
      });
    }

    // 2️⃣ Check if user already exists
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

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4️⃣ Insert user
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

    // 5️⃣ Create JWT
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // 6️⃣ Send response (MATCHES FRONTEND EXPECTATION)
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

module.exports = router;
