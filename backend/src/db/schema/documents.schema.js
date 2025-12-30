const {
  pgTable,
  serial,
  text,
  integer,
  timestamp
} = require("drizzle-orm/pg-core");

exports.documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),

  originalFilename: text("original_filename").notNull(),
  fileUrl: text("file_url").notNull(),

  translatedFileUrl: text("translated_file_url"),
  status: text("status").default("UPLOADED"),
  createdAt: timestamp("created_at").defaultNow(),
});
