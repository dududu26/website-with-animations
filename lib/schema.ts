import { 
  pgTable, 
  text, 
  serial, 
  timestamp, 
  integer,
  boolean,
  varchar,
  uniqueIndex,
  index,
  foreignKey,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table (extended from Better Auth)
export const users = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email').unique().notNull(),
    emailVerified: boolean('emailVerified').default(false),
    name: text('name'),
    image: text('image'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    ipAddress: varchar('ipAddress', { length: 45 }), // IPv4 or IPv6
    accountStatus: varchar('accountStatus', { length: 20 }).default('active'), // active, suspended, banned
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
    ipIdx: index('ip_idx').on(table.ipAddress),
  })
)

// User IPs table - tracks IP registrations
export const userIps = pgTable(
  'user_ip',
  {
    id: serial('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ipAddress: varchar('ipAddress', { length: 45 }).notNull(),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    ipUnique: uniqueIndex('ip_unique_idx').on(table.ipAddress),
    ipIdx: index('user_ip_idx').on(table.ipAddress),
    userIdIdx: index('user_id_ip_idx').on(table.userId),
  })
)

// Sessions table (Better Auth)
export const sessions = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expiresAt').notNull(),
    ipAddress: varchar('ipAddress', { length: 45 }),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('session_user_idx').on(table.userId),
  })
)

// Accounts table (Better Auth - for social logins if needed)
export const accounts = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    expiresAt: timestamp('expiresAt'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('account_user_idx').on(table.userId),
  })
)

// Verifications table (Better Auth)
export const verifications = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
  }
)

// Posts table
export const posts = pgTable(
  'post',
  {
    id: serial('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    deletedAt: timestamp('deletedAt'), // soft delete
  },
  (table) => ({
    userIdIdx: index('post_user_idx').on(table.userId),
    createdAtIdx: index('post_created_idx').on(table.createdAt),
  })
)

// Post Attachments table
export const postAttachments = pgTable(
  'post_attachment',
  {
    id: serial('id').primaryKey(),
    postId: integer('postId')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    fileUrl: text('fileUrl').notNull(),
    fileName: varchar('fileName', { length: 255 }).notNull(),
    fileSize: integer('fileSize').notNull(), // in bytes
    fileType: varchar('fileType', { length: 100 }),
    uploadedAt: timestamp('uploadedAt').defaultNow(),
  },
  (table) => ({
    postIdIdx: index('attachment_post_idx').on(table.postId),
  })
)

// Comments table
export const comments = pgTable(
  'comment',
  {
    id: serial('id').primaryKey(),
    postId: integer('postId')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    parentCommentId: integer('parentCommentId').references(() => comments.id, { onDelete: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    deletedAt: timestamp('deletedAt'), // soft delete
  },
  (table) => ({
    postIdIdx: index('comment_post_idx').on(table.postId),
    userIdIdx: index('comment_user_idx').on(table.userId),
    parentIdIdx: index('comment_parent_idx').on(table.parentCommentId),
  })
)

// Post Reactions table
export const postReactions = pgTable(
  'post_reaction',
  {
    id: serial('id').primaryKey(),
    postId: integer('postId')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    reactionType: varchar('reactionType', { length: 50 }).notNull(), // 'like', 'love', 'wow', 'sad', 'angry'
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    postReactionUnique: uniqueIndex('post_reaction_unique').on(table.postId, table.userId, table.reactionType),
    postIdIdx: index('post_reaction_post_idx').on(table.postId),
    userIdIdx: index('post_reaction_user_idx').on(table.userId),
  })
)

// Comment Reactions table
export const commentReactions = pgTable(
  'comment_reaction',
  {
    id: serial('id').primaryKey(),
    commentId: integer('commentId')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    reactionType: varchar('reactionType', { length: 50 }).notNull(), // 'like', 'love', 'wow', 'sad', 'angry'
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => ({
    commentReactionUnique: uniqueIndex('comment_reaction_unique').on(table.commentId, table.userId, table.reactionType),
    commentIdIdx: index('comment_reaction_comment_idx').on(table.commentId),
    userIdIdx: index('comment_reaction_user_idx').on(table.userId),
  })
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  postReactions: many(postReactions),
  commentReactions: many(commentReactions),
  userIps: many(userIps),
  sessions: many(sessions),
  accounts: many(accounts),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  attachments: many(postAttachments),
  comments: many(comments),
  reactions: many(postReactions),
}))

export const attachmentsRelations = relations(postAttachments, ({ one }) => ({
  post: one(posts, { fields: [postAttachments.postId], references: [posts.id] }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: 'child_comments',
  }),
  childComments: many(comments, { relationName: 'child_comments' }),
  reactions: many(commentReactions),
}))

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  post: one(posts, { fields: [postReactions.postId], references: [posts.id] }),
  user: one(users, { fields: [postReactions.userId], references: [users.id] }),
}))

export const commentReactionsRelations = relations(commentReactions, ({ one }) => ({
  comment: one(comments, { fields: [commentReactions.commentId], references: [comments.id] }),
  user: one(users, { fields: [commentReactions.userId], references: [users.id] }),
}))

export const userIpsRelations = relations(userIps, ({ one }) => ({
  user: one(users, { fields: [userIps.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))
