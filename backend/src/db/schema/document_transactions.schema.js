const { pgTable, serial, integer, jsonb, text, timestamp } = require("drizzle-orm/pg-core");
const { documents } = require("./documents.schema");

exports.documentTransactions = pgTable("document_transactions", {
  id: serial("id").primaryKey(),

  documentId: integer("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),

  extractedJson: jsonb("extracted_json").notNull(),

  source: text("source"), // "translated" | "original"

  createdAt: timestamp("created_at").defaultNow(),
});
