import { relations } from "drizzle-orm/relations";
import { suggestions, prizes, users, accounts, sessions } from "./schema";

export const prizesRelations = relations(prizes, ({one}) => ({
	suggestion: one(suggestions, {
		fields: [prizes.suggestionId],
		references: [suggestions.id]
	}),
}));

export const suggestionsRelations = relations(suggestions, ({one, many}) => ({
	prizes: many(prizes),
	user: one(users, {
		fields: [suggestions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	suggestions: many(suggestions),
	accounts: many(accounts),
	sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));