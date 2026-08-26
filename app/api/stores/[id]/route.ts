import { NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex-server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ message: 'id is missing' }, { status: 400 });
    }
    const store = await getConvexClient().query(api.stores.getByExternalId, {
      externalId: params.id,
    });
    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }
    return NextResponse.json([store]);
  } catch (err) {
    console.error('Failed to fetch store record', err);
    return NextResponse.json(
      { message: 'Something went wrong fetching the store.' },
      { status: 500 }
    );
  }
}

/** Rate an existing store. */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: { rating?: number } = await request.json();
    const { rating } = body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'A "rating" between 1 and 5 is required.' },
        { status: 400 }
      );
    }

    await getConvexClient().mutation(api.stores.rate, {
      externalId: params.id,
      rating,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error rating store', err);
    const notFound = err instanceof Error && err.message === 'Store not found';
    return NextResponse.json(
      {
        message: notFound
          ? 'Store not found yet. Open the store page so it can be saved first.'
          : 'Something went wrong saving your rating.',
      },
      { status: notFound ? 404 : 500 }
    );
  }
}

/** Create the store record if it doesn't exist yet. */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: {
      name?: string;
      address?: string;
      neighborhood?: string;
      category?: string;
      image_url?: string;
    } = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { message: '"name" is required.' },
        { status: 400 }
      );
    }

    const id = await getConvexClient().mutation(api.stores.upsert, {
      externalId: params.id,
      name: body.name,
      address: body.address ?? '',
      neighborhood: body.neighborhood,
      category: body.category,
      imageUrl: body.image_url,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error('Error creating store', err);
    return NextResponse.json(
      { message: 'Error creating or finding a store.' },
      { status: 500 }
    );
  }
}
