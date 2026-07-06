import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
  boolean,
  primaryKey,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { AssetData } from '@/lib/vault/types';
import type { IconSet } from '@/lib/canon/types';

/**
 * Struq datamodel (M2).
 *
 * The `asset_type` enum is FROZEN to the five visual types — prompts are a
 * `text` column on `assets`, never a type (hard constraint). The `data` column
 * is a single jsonb holding the discriminated union from lib/vault/types.ts so
 * the vault UI reads `asset.data` as a variant with zero UI change.
 *
 * Auth tables (users/accounts/sessions/verification_tokens) follow the Auth.js
 * v5 Drizzle shape — created now so favorites/kits can key on a user, but NO
 * auth flow is wired this slice (that's M5).
 */

export const assetTypeEnum = pgEnum('asset_type', [
  'palette',
  'typography',
  'design_system',
  'section',
  'media',
]);

export const assetTierEnum = pgEnum('asset_tier', ['free', 'pro']);

export const assets = pgTable(
  'assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Stable import key, e.g. 'canon:palette:graphite-ivory'. Upsert target so
    // canon re-imports never duplicate.
    provenance: text('provenance').notNull(),
    type: assetTypeEnum('type').notNull(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    // The copyable AI payload — metadata on the visual asset, never the entity.
    prompt: text('prompt').notNull(),
    // The discriminated variant from lib/vault/types.ts (PaletteData | ... ).
    data: jsonb('data').$type<AssetData>().notNull(),
    tier: assetTierEnum('tier').notNull().default('free'),
    tags: text('tags').array().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('assets_provenance_key').on(t.provenance),
    uniqueIndex('assets_type_slug_key').on(t.type, t.slug),
    index('assets_type_idx').on(t.type),
    index('assets_tags_gin_idx').using('gin', t.tags),
  ]
);

// Media rows link an `assets` row (type 'media') to its source binary. This
// slice stores metadata + canon_path only — no binaries are copied into the
// repo; a later slice uploads to object storage from canon_path.
export const assetMedia = pgTable('asset_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id')
    .notNull()
    .references(() => assets.id, { onDelete: 'cascade' }),
  canonPath: text('canon_path'),
  aspectRatio: text('aspect_ratio'),
  width: integer('width'),
  height: integer('height'),
  // CSS background used until the real media is served.
  placeholder: text('placeholder'),
  role: text('role'),
});

// ── Auth.js v5 minimal (tables only, no flow) ──────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  tier: assetTierEnum('tier').notNull().default('free'),
  // Admin flag. Gates nothing yet (the admin studio isn't ported); the column
  // exists so admin gating can key on real data once those features land.
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
    // Argon2 hash for the 'credentials' provider row (email/password). Null for
    // OAuth accounts — only the credentials row uses it.
    passwordHash: text('password_hash'),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ── User data (replaces localStorage stopgaps) ─────────────────────────────

// Replaces the saved-assets localStorage (hooks/use-saved-assets.ts).
export const favorites = pgTable(
  'favorites',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.assetId] })]
);

export const kits = pgTable('kits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const kitAssets = pgTable(
  'kit_assets',
  {
    kitId: uuid('kit_id')
      .notNull()
      .references(() => kits.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.kitId, t.assetId] })]
);

// Replaces lib/canon/use-icon-candidates localStorage (Canon → Icons tab).
// user_id nullable so a signed-out import still has a home once sessions land.
export const importedIconCandidates = pgTable('imported_icon_candidates', {
  // The candidate.<prefix> id (client-generated, stable).
  id: text('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  payload: jsonb('payload').$type<IconSet>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
