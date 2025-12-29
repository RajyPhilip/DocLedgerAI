const {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} = require("drizzle-orm/pg-core");

exports.documentTexts = pgTable("document_texts", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull(),
  type: text("type").notNull(), // original | translated
  createdAt: timestamp("created_at").defaultNow(),
});
