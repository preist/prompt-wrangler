import type { DetectedIssue, DismissedItem } from '@utils/detectors/types';

export interface StorageSchema {
  detected_issues: DetectedIssue[];
  dismissed_items: DismissedItem[];
}

export type StorageKey = keyof StorageSchema;
