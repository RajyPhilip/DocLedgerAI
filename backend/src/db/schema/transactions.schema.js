const { pgTable, serial, text, integer, date, timestamp } =
  require("drizzle-orm/pg-core");

const { properties } = require("./properties.schema");

const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),

  propertyId: integer("property_id")
    .references(() => properties.id)
    .notNull(),

  documentNumber: text("document_number").notNull(),
  transactionDate: date("transaction_date"),
  transactionValue: text("transaction_value"),

  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { transactions };
