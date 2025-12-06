import { pgTable, uuid, varchar, date, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1024 }).notNull(),
    stock: integer("stock").notNull(),
    price: integer("price").notNull(),
    wishlists: integer("wishlists").notNull().default(0),
    ownerId: uuid("owner_id").notNull().references(() => users.id),
})

export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
})

export const userPurchases = pgTable("user_purchases", {
    purchaseId: uuid("id").primaryKey(),
    userId: uuid("user_id")
        .notNull().references(() => users.id),
    productId: uuid("product_id")
        .notNull().references(() => products.id),
    date: date("date").notNull(),
})