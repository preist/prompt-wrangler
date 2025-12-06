import type { DetectedIssue, Detector } from './types';

// Detects US and international phone numbers
// US: (555) 123-4567, 555-123-4567, +1-555-123-4567
// International: +972 50 123 4567, +44 20 7123 4567, etc.
const US_PATTERN = /(?:\+?1\s?[-.]?\s?)?\(?[2-9]\d{2}\)?\s?[-.]?\s?\d{3}\s?[-.]?\s?\d{4}\b/g;
const INTL_PATTERN =
  /\+\d{1,3}\s?[-.]?\s?(?:\(?\d{1,4}\)?[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}(?:[\s.-]?\d{1,4})?\b/g;

const PATTERNS = [INTL_PATTERN, US_PATTERN]; // Order matters: most specific first
const PHONE_PLACEHOLDER = '[PHONE_NUMBER]';

interface TextRange {
  start: number;
  end: number;
}

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function addMatch(
  issues: DetectedIssue[],
  consumedRanges: TextRange[],
  match: RegExpMatchArray
): void {
  if (!match[0] || match.index === undefined) return;

  const start = match.index;
  const end = start + match[0].length;
  const isConsumed = consumedRanges.some((range) => start < range.end && end > range.start);

  if (!isConsumed) {
    consumedRanges.push({ start, end });
    issues.push({
      id: generateId(),
      type: 'phone',
      value: match[0],
      timestamp: Date.now(),
    });
  }
}

function detect(text: string): DetectedIssue[] {
  const issues: DetectedIssue[] = [];
  const consumedRanges: TextRange[] = [];

  for (const pattern of PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      addMatch(issues, consumedRanges, match);
    }
  }

  return issues.sort((a, b) => text.indexOf(a.value) - text.indexOf(b.value));
}

function anonymize(text: string, dismissed: Set<string>): string {
  let result = text;

  for (const pattern of PATTERNS) {
    result = result.replace(pattern, (match) =>
      dismissed.has(match.toLowerCase()) ? match : PHONE_PLACEHOLDER
    );
  }

  return result;
}

export const phoneDetector: Detector = {
  type: 'phone',
  pattern: US_PATTERN,
  placeholder: PHONE_PLACEHOLDER,
  detect,
  anonymize,
};
