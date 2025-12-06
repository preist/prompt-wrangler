import type { Detector, DetectedIssue, DetectionResult, DismissedItem } from './detectors/types';
import { emailDetector } from './detectors/emailDetector';

const DETECTORS: Detector[] = [emailDetector];

function isDismissed(item: DismissedItem): boolean {
  return Date.now() < item.dismissedUntil;
}

function getDismissedSet(dismissedItems: DismissedItem[]): Set<string> {
  const dismissed = new Set<string>();

  for (const item of dismissedItems) {
    if (isDismissed(item)) {
      dismissed.add(item.value.toLowerCase());
    }
  }

  return dismissed;
}

export function scanText(text: string, dismissedItems: DismissedItem[] = []): DetectionResult {
  const allIssues: DetectedIssue[] = [];
  const dismissedSet = getDismissedSet(dismissedItems);

  for (const detector of DETECTORS) {
    const issues = detector.detect(text);

    const nonDismissedIssues = issues.filter(
      (issue) => !dismissedSet.has(issue.value.toLowerCase())
    );

    allIssues.push(...nonDismissedIssues);
  }

  let anonymizedText = text;
  for (const detector of DETECTORS) {
    anonymizedText = detector.anonymize(anonymizedText, dismissedSet);
  }

  return {
    issues: allIssues,
    anonymizedText,
  };
}

export function removeDuplicateIssues(issues: DetectedIssue[]): DetectedIssue[] {
  const seen = new Map<string, DetectedIssue>();

  for (const issue of issues) {
    const key = `${issue.type}:${issue.value.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.set(key, issue);
    }
  }

  return Array.from(seen.values());
}
