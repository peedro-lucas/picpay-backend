import { pgTable, serial, text, numeric } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  balance: numeric("balance", { precision: 10, scale: 2 }).default("0"),
  type: text("type").notNull(), // common | merchant
});