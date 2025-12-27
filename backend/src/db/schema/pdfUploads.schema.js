const { pgTable, serial, text, integer, timestamp } =
  require("drizzle-orm/pg-core");

const { users } = require("./users.schema");

const pdfUploads = pgTable("pdf_uploads", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  fileName: text("file_name").notNull(),

  // 🔑 S3 object key (important for backend ops)
  storageKey: text("storage_key").notNull(),

  // 🌍 CloudFront URL (used by frontend)
  fileUrl: text("file_url").notNull(),

  mimeType: text("mime_type").default("application/pdf"),

  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { pdfUploads };
