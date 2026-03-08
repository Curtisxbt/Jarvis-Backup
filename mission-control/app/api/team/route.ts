import { NextResponse } from 'next/server';
import team from '@/data/team.json';

export async function GET() {
  return NextResponse.json({ team });
}
