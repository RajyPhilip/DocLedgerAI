const { relations } = require("drizzle-orm");

const { users } = require("./schema/users.schema");
const { properties } = require("./schema/properties.schema");
const { transactions } = require("./schema/transactions.schema");
const { transactionVersions } = require("./schema/transactionVersions.schema");
const { pdfUploads } = require("./schema/pdfUploads.schema");

// Property → Transactions
const propertyRelations = relations(properties, ({ many }) => ({
  transactions: many(transactions),
}));

// Transaction → Versions
const transactionRelations = relations(transactions, ({ many }) => ({
  versions: many(transactionVersions),
}));

// User → PDF uploads
const userRelations = relations(users, ({ many }) => ({
  uploads: many(pdfUploads),
}));

module.exports = {
  propertyRelations,
  transactionRelations,
  userRelations,
};
