import { NextResponse } from 'next/server';
import { fetchHalalStores } from '@/lib/foursquare';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latLong = searchParams.get('latLong');
  const query = searchParams.get('query')?.trim() || 'halal';
  const limit = Math.min(Number(searchParams.get('limit')) || 30, 50);

  if (!latLong || !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(latLong)) {
    return NextResponse.json(
      { message: 'A valid "latLong" query parameter (lat,lng) is required.' },
      { status: 400 }
    );
  }

  try {
    const stores = await fetchHalalStores({ latLong, query, limit });
    return NextResponse.json(stores);
  } catch (err) {
    console.error('Failed to fetch stores by location', err);
    return NextResponse.json(
      { message: 'Something went wrong fetching stores.' },
      { status: 500 }
    );
  }
}
