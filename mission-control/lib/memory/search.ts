import { getMemoryDocuments } from '@/lib/memory/scan';
import { MemoryDocument } from '@/lib/memory/types';

export interface MemorySearchParams {
  query?: string;
  agent?: string;
  kind?: string;
}

export async function searchMemory(params: MemorySearchParams): Promise<MemoryDocument[]> {
  const docs = await getMemoryDocuments();
  const query = params.query?.trim().toLowerCase();

  return docs.filter((doc) => {
    const agentOk = params.agent ? doc.agent === params.agent : true;
    const kindOk = params.kind ? doc.kind === params.kind : true;
    const queryOk = query
      ? [doc.title, doc.relativePath, doc.content].join('\n').toLowerCase().includes(query)
      : true;

    return agentOk && kindOk && queryOk;
  });
}
