const {
  findUserByEmail,
  createUser,
} = require("../services/user.service");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../services/auth.service");

exports.verifyUser = async (req, res) => {
  try {
    // set by auth.middleware
    const userId = req.user.userId;;

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobileNumber: users.mobileNumber,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    return res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Verify user error:", error);
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, name, mobile_number } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        status: "error",
        message: "Email, password and name are required",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await createUser({
      email,
      passwordHash,
      name,
      mobileNumber: mobile_number,
    });

    const token = generateToken(user);

    return res.status(201).json({
      status: "success",
      data: { token, user },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);
    delete user.passwordHash;

    return res.json({
      status: "success",
      data: { token, user },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
