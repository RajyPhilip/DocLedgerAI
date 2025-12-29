import { pgTable, serial, text, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	mobileNumber: bigint("mobile_number", { mode: "number" }),
});
