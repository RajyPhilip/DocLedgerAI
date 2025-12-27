const { pgTable, serial, text, timestamp } =
  require("drizzle-orm/pg-core");

const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  surveyNumber: text("survey_number").notNull(),
  district: text("district"),
  village: text("village"),
  houseNumber: text("house_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { properties };
