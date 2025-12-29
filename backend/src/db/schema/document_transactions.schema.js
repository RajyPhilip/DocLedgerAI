const { pgTable, serial, integer, text, jsonb } = require("drizzle-orm/pg-core");
import { documents } from "./documents.schema";

export const documentTransactions = pgTable("document_transactions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .references(() => documents.id)
    .notNull(),

  docNo: text("doc_no"),
  executionDate: text("execution_date"),
  registrationDate: text("registration_date"),
  nature: text("nature"),
  considerationValue: text("consideration_value"),
  marketValue: text("market_value"),

  surveyNumbers: jsonb("survey_numbers"),
  plotNumber: text("plot_number"),
  extent: text("extent"),
});