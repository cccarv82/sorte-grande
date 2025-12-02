import { pgTable, index, unique, serial, text, integer, date, jsonb, timestamp, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const lotteryResults = pgTable("lottery_results", {
	id: serial().primaryKey().notNull(),
	lottery: text().notNull(),
	contestNumber: integer("contest_number").notNull(),
	drawNumbers: integer("draw_numbers").array().notNull(),
	drawDate: date("draw_date").notNull(),
	prizes: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_lottery_results_draw_date").using("btree", table.drawDate.asc().nullsLast().op("date_ops")),
	index("idx_lottery_results_lottery").using("btree", table.lottery.asc().nullsLast().op("text_ops")),
	unique("uq_lottery_results_contest").on(table.lottery, table.contestNumber),
]);

export const prizes = pgTable("prizes", {
	id: serial().primaryKey().notNull(),
	suggestionId: integer("suggestion_id").notNull(),
	gameIndex: integer("game_index").notNull(),
	contestNumber: integer("contest_number").notNull(),
	prizeTier: text("prize_tier").notNull(),
	prizeValue: integer("prize_value"),
	matchedNumbers: integer("matched_numbers").array().notNull(),
	viewedAt: timestamp("viewed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_prizes_suggestion_id").using("btree", table.suggestionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.suggestionId],
			foreignColumns: [suggestions.id],
			name: "prizes_suggestion_id_suggestions_id_fk"
		}).onDelete("cascade"),
]);

export const suggestions = pgTable("suggestions", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	lottery: text().notNull(),
	value: integer().notNull(),
	games: jsonb().notNull(),
	wheelTemplate: text("wheel_template"),
	guarantee: text(),
	status: text().default('pending').notNull(),
	contestNumber: integer("contest_number"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	realizedAt: timestamp("realized_at", { mode: 'string' }),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
}, (table) => [
	index("idx_suggestions_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_suggestions_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "suggestions_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_users_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("users_email_unique").on(table.email),
]);

export const verificationTokens = pgTable("verification_tokens", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	unique("verification_tokens_pkey").on(table.identifier, table.token),
	unique("verification_tokens_token_unique").on(table.token),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text("provider_account_id").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	sessionToken: text("session_token").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
]);
