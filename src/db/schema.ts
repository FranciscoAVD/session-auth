import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  salt: varchar("salt", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").default(false),
});

export const sessionTable = pgTable("sessions", {
  id: varchar("id", {length: 255}).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull(),
});

// export const verificationCodeTable = pgTable("verification_code", {
//   id: varchar("id", {length: 255}).primaryKey(),
//   userId: varchar("user_id")
//     .notNull()
//     .references(() => userTable.id),
//   code: varchar("code", { length: 255 }).unique().notNull(),
//   createdAt: timestamp("created_at").defaultNow(),                            
//   expiresAt: timestamp("expires_at").notNull(),
// });

export type TUser = InferSelectModel<typeof userTable>
export type TSession = InferSelectModel<typeof sessionTable>
// export type TVerficationCode = InferSelectModel<typeof verificationCodeTable>