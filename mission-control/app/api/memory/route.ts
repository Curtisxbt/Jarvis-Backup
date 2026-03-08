import { NextRequest, NextResponse } from 'next/server';
import { searchMemory } from '@/lib/memory/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const docs = await searchMemory({
    query: searchParams.get('q') ?? undefined,
    agent: searchParams.get('agent') ?? undefined,
    kind: searchParams.get('kind') ?? undefined,
  });

  return NextResponse.json({ docs });
}
