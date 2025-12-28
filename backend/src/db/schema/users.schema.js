const { pgTable, serial, text, bigint } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  mobileNumber: bigint("mobile_number", { mode: "number" }),
});

module.exports = { users };
