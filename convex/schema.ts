import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  halalStores: defineTable({
    externalId: v.string(),
    name: v.string(),
    address: v.string(),
    neighborhood: v.optional(v.string()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    ratingCount: v.number(),
    ratingSum: v.number(),
  }).index('by_external_id', ['externalId']),
});
