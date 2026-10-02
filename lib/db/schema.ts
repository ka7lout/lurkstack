import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Better Auth managed tables                                          */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ------------------------------------------------------------------ */
/* Application tables                                                  */
/* ------------------------------------------------------------------ */

export const post = pgTable(
  "post",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    authorIdx: index("post_author_idx").on(t.authorId),
    createdIdx: index("post_created_idx").on(t.createdAt),
  }),
);

export const comment = pgTable(
  "comment",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    postIdx: index("comment_post_idx").on(t.postId),
    authorIdx: index("comment_author_idx").on(t.authorId),
  }),
);

export const postLike = pgTable(
  "post_like",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniquePair: uniqueIndex("post_like_unique").on(t.postId, t.userId),
    postIdx: index("post_like_post_idx").on(t.postId),
  }),
);

export const auditEvent = pgTable(
  "audit_event",
  {
    id: text("id").primaryKey(),
    requestId: text("request_id"),
    action: text("action").notNull(),
    result: text("result").notNull(), // allowed | blocked | failure
    severity: text("severity").notNull(), // info | notice | warning | critical
    reasonCode: text("reason_code"),
    actorId: text("actor_id"),
    actorName: text("actor_name"),
    targetUserId: text("target_user_id"),
    targetName: text("target_name"),
    summary: text("summary"),
    meta: jsonb("meta"),
    fingerprint: text("fingerprint").notNull(),
    repeatCount: integer("repeat_count").default(1).notNull(),
    alertState: text("alert_state").default("pending").notNull(), // pending | sent | skipped | failed
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    fpIdx: index("audit_fingerprint_idx").on(t.fingerprint),
    createdIdx: index("audit_created_idx").on(t.createdAt),
  }),
);

export type User = typeof user.$inferSelect;
export type Post = typeof post.$inferSelect;
export type Comment = typeof comment.$inferSelect;
export type PostLike = typeof postLike.$inferSelect;
export type AuditEvent = typeof auditEvent.$inferSelect;
