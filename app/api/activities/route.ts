import { NextResponse } from 'next/server';
import { fetchMuslimActivities } from '@/lib/osm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latLong = searchParams.get('latLong');

  if (!latLong || !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(latLong)) {
    return NextResponse.json(
      { message: 'A valid "latLong" query parameter (lat,lng) is required.' },
      { status: 400 }
    );
  }

  try {
    const activities = await fetchMuslimActivities(latLong);
    return NextResponse.json(activities);
  } catch (err) {
    console.error('Failed to fetch activities', err);
    return NextResponse.json(
      { message: 'Something went wrong fetching activities.' },
      { status: 500 }
    );
  }
}
