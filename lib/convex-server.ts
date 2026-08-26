import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

let cached: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!cached) {
    cached = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }
  return cached;
}

export { api };
