import type { Issue } from '@popup/state/IssuesContext';

export interface BatchGroup {
  batchId: string;
  timestamp: number;
  issues: Issue[];
}
