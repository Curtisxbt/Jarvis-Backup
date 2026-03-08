import { getAgentProfiles } from '@/lib/agents/registry';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { getTasks } from '@/lib/tasks/store';

export interface ResolvedLinkItem {
  id: string;
  label: string;
  meta: string;
  href?: string;
}

export async function getLinkableResources() {
  const [memoryDocs, cronJobs] = await Promise.all([getMemoryDocuments(), getCronJobs()]);
  const agents = getAgentProfiles();

  return {
    memoryOptions: memoryDocs.map((doc) => ({
      id: doc.id,
      label: doc.title,
      meta: `${translateAgent(doc.agent)} · ${doc.relativePath}`,
      href: `/memory?docId=${encodeURIComponent(doc.id)}`,
    })),
    cronOptions: cronJobs.map((job) => ({
      id: job.id,
      label: job.name,
      meta: `${job.agentId || 'défaut'} · ${job.schedule}`,
      href: `/calendar?jobId=${encodeURIComponent(job.id)}`,
    })),
    agentOptions: agents.map((agent) => ({
      id: agent.name,
      label: agent.name,
      meta: agent.role,
      href: `/team`,
    })),
  };
}

export async function getTaskRelations() {
  const [tasks, memoryDocs, cronJobs] = await Promise.all([getTasks(), getMemoryDocuments(), getCronJobs()]);

  const tasksByMemoryId = new Map<string, typeof tasks>();
  const tasksByCronId = new Map<string, typeof tasks>();

  for (const task of tasks) {
    for (const memoryId of task.relatedMemoryIds || []) {
      tasksByMemoryId.set(memoryId, [...(tasksByMemoryId.get(memoryId) || []), task]);
    }
    for (const cronId of task.relatedCronIds || []) {
      tasksByCronId.set(cronId, [...(tasksByCronId.get(cronId) || []), task]);
    }
  }

  return {
    tasks,
    memoryDocs,
    cronJobs,
    tasksByMemoryId,
    tasksByCronId,
  };
}

function translateAgent(agent: string) {
  if (agent === 'shared') return 'Partagé';
  return agent.charAt(0).toUpperCase() + agent.slice(1);
}
