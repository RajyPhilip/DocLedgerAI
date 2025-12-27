const { pgTable, serial, text, integer, timestamp } =
  require("drizzle-orm/pg-core");

const { transactions } = require("./transactions.schema");

const transactionVersions = pgTable("transaction_versions", {
  id: serial("id").primaryKey(),

  transactionId: integer("transaction_id")
    .references(() => transactions.id)
    .notNull(),

  language: text("language").notNull(), // ta / en
  buyerName: text("buyer_name"),
  sellerName: text("seller_name"),
  rawText: text("raw_text"),

  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { transactionVersions };
