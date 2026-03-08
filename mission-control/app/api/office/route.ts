import { NextResponse } from 'next/server';
import office from '@/data/office.json';

export async function GET() {
  return NextResponse.json({ office });
}
