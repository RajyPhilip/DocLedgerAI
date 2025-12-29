import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { documents } from "./documents.schema";

export const documentAiOutputs = pgTable("document_ai_outputs", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .references(() => documents.id)
    .notNull(),

  summaryText: text("summary_text"),
  createdAt: timestamp("created_at").defaultNow(),
});