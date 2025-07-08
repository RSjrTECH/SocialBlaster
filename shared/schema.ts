import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  platforms: jsonb("platforms").notNull(), // Array of platform names
  mediaUrls: jsonb("media_urls"), // Array of media URLs
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("draft"), // draft, posting, completed, failed
});

export const postResults = pgTable("post_results", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull(), // success, failed, pending
  message: text("message"),
  externalId: text("external_id"),
  postedAt: timestamp("posted_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  platforms: true,
  mediaUrls: true,
  scheduledAt: true,
}).extend({
  platforms: z.array(z.string()),
  mediaUrls: z.array(z.string()).optional(),
});

export const insertPostResultSchema = createInsertSchema(postResults).pick({
  postId: true,
  platform: true,
  status: true,
  message: true,
  externalId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPostResult = z.infer<typeof insertPostResultSchema>;
export type PostResult = typeof postResults.$inferSelect;
