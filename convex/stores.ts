import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('halalStores')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    address: v.string(),
    neighborhood: v.optional(v.string()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('halalStores')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .unique();

    if (existing) return existing._id;
    return await ctx.db.insert('halalStores', {
      ...args,
      ratingCount: 0,
      ratingSum: 0,
    });
  },
});

export const rate = mutation({
  args: { externalId: v.string(), rating: v.number() },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query('halalStores')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .unique();

    if (!store) throw new Error('Store not found');

    await ctx.db.patch(store._id, {
      ratingCount: store.ratingCount + 1,
      ratingSum: store.ratingSum + args.rating,
    });
  },
});
