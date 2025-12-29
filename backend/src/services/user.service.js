const db = require("../db");
const { users } = require("../db/schema/users.schema");
const { eq } = require("drizzle-orm");

const findUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return user || null;
};

const createUser = async ({ email, passwordHash, name, mobileNumber }) => {
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name,
      mobileNumber,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      mobile_number: users.mobileNumber,
    });

  return user;
};

module.exports = {
  findUserByEmail,
  createUser,
};
