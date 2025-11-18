import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const submissionStatusEnum = pgEnum('submission_status', [
  'PENDING',
  'RUNNING',
  'SUCCESS',
  'FAILED',
]);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  imageUrl: text('image_url').notNull(),
  points: integer('points').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const learningTrails = pgTable('learning_trails', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  pointsAwarded: integer('points_awarded').notNull(),
  order: integer('order').notNull(),
  trailId: text('trail_id')
    .notNull()
    .references(() => learningTrails.id, { onDelete: 'cascade' }),
});

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  status: submissionStatusEnum('status').notNull().default('PENDING'),
  resultOutput: text('result_output'),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
}));
export const learningTrailsRelations = relations(
  learningTrails,
  ({ many }) => ({ projects: many(projects) }),
);
export const projectsRelations = relations(projects, ({ one, many }) => ({
  trail: one(learningTrails, {
    fields: [projects.trailId],
    references: [learningTrails.id],
  }),
  submissions: many(submissions),
}));
export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  project: one(projects, {
    fields: [submissions.projectId],
    references: [projects.id],
  }),
}));
