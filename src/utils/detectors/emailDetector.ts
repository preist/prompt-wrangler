import type { Detector, DetectedIssue } from './types';

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

const EMAIL_PLACEHOLDER = '[EMAIL_ADDRESS]';

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function detect(text: string): DetectedIssue[] {
  const matches = text.matchAll(EMAIL_PATTERN);
  const issues: DetectedIssue[] = [];

  for (const match of matches) {
    if (match[0]) {
      issues.push({
        id: generateId(),
        type: 'email',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function anonymize(text: string, dismissed: Set<string>): string {
  return text.replace(EMAIL_PATTERN, (match) => {
    if (dismissed.has(match.toLowerCase())) {
      return match;
    }
    return EMAIL_PLACEHOLDER;
  });
}

export const emailDetector: Detector = {
  type: 'email',
  pattern: EMAIL_PATTERN,
  placeholder: EMAIL_PLACEHOLDER,
  detect,
  anonymize,
};
