import { NextResponse } from 'next/server';
import { getCronJobs } from '@/lib/cron/openclaw';

export async function GET() {
  const jobs = await getCronJobs();
  return NextResponse.json({ jobs });
}
