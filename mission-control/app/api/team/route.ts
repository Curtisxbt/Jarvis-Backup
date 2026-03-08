import { NextRequest, NextResponse } from 'next/server';
import team from '@/data/team.json';
import { getTasks } from '@/lib/tasks/store';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { getRuntimeSignal } from '@/lib/agents/runtime';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('stream') === '1') {
    return createLiveStream();
  }

  return NextResponse.json({ team });
}

async function getLiveSnapshot() {
  const [tasks, cronJobs, memoryDocs, runtime] = await Promise.all([
    getTasks(),
    getCronJobs(),
    getMemoryDocuments(),
    getRuntimeSignal(),
  ]);

  const snapshot = {
    ts: new Date().toISOString(),
    openTasks: tasks.filter((task) => task.status !== 'done').length,
    blockedTasks: tasks.filter((task) => task.status === 'blocked').length,
    cronJobs: cronJobs.length,
    cronHealthy: cronJobs.filter((job) => job.lastStatus === 'ok').length,
    recentMemoryKey: memoryDocs.slice(0, 5).map((doc) => `${doc.id}:${doc.updatedAt}`).join('|'),
    activeSessions: runtime.activeSessions,
    gatewayReachable: runtime.gatewayReachable,
    runtimeKey: runtime.agents.map((agent) => `${agent.agentId}:${agent.sessionsCount}:${agent.lastActiveAgeMs ?? 'na'}:${agent.lastModel ?? 'na'}:${agent.recentPercentUsed ?? 'na'}`).join('|'),
  };

  return {
    ...snapshot,
    digest: JSON.stringify({
      openTasks: snapshot.openTasks,
      blockedTasks: snapshot.blockedTasks,
      cronJobs: snapshot.cronJobs,
      cronHealthy: snapshot.cronHealthy,
      recentMemoryKey: snapshot.recentMemoryKey,
      activeSessions: snapshot.activeSessions,
      gatewayReachable: snapshot.gatewayReachable,
      runtimeKey: snapshot.runtimeKey,
    }),
  };
}

function createLiveStream() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const push = async () => {
        if (closed) return;
        try {
          const snapshot = await getLiveSnapshot();
          controller.enqueue(encoder.encode(`event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`));
        } catch (error) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: error instanceof Error ? error.message : 'live error', ts: new Date().toISOString() })}\n\n`));
        }
      };

      await push();
      const interval = setInterval(push, 15000);
      const heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
      }, 10000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {}
      };

      // @ts-expect-error Next runtime exposes cancel path through stream lifecycle.
      controller._cleanup = cleanup;
    },
    cancel() {
      return;
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
