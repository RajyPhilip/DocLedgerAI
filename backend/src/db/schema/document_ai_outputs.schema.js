const { pgTable, serial, integer, text, timestamp } =
  require("drizzle-orm/pg-core");

const { documents } = require("./documents.schema");

exports.documentAIOutputs = pgTable("document_ai_outputs", {
  id: serial("id").primaryKey(),

  documentId: integer("document_id")
    .references(() => documents.id)
    .notNull(),

  summaryText: text("summary_text"),

  createdAt: timestamp("created_at").defaultNow(),
});
