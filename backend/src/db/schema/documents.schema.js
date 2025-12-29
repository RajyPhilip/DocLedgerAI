import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  originalFilename: text("original_filename").notNull(),
  fileUrl: text("file_url").notNull(),
  translatedFileUrl: text("translated_file_url"),

  status: text("status").default("UPLOADED"),
  createdAt: timestamp("created_at").defaultNow(),
});