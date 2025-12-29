import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { documents } from "./documents.schema";

export const documentTexts = pgTable("document_texts", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .references(() => documents.id)
    .notNull(),

  rawText: text("raw_text"),
  translatedText: text("translated_text"),
});