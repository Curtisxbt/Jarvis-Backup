import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const jobId = String(body.jobId || '').trim();
  const enabled = Boolean(body.enabled);
  if (!jobId) return NextResponse.json({ error: 'jobId manquant' }, { status: 400 });

  try {
    const subcommand = enabled ? 'enable' : 'disable';
    const result = await execFileAsync('openclaw', ['cron', subcommand, jobId], {
      cwd: '/home/jarvis/.openclaw/workspace',
      timeout: 60000,
      maxBuffer: 1024 * 1024,
    });
    return NextResponse.json({ ok: true, stdout: result.stdout });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Échec toggle cron' }, { status: 500 });
  }
}
