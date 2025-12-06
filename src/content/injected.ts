// This script runs in the page's main world, not the isolated content script world
// It has access to the page's actual fetch function before any app code runs

interface DetectedIssue {
  id: string;
  type: string;
  value: string;
  timestamp: number;
}

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const EMAIL_PLACEHOLDER = '[EMAIL_ADDRESS]';

const US_PHONE_PATTERN = /(?:\+?1\s?[-.]?\s?)?\(?[2-9]\d{2}\)?\s?[-.]?\s?\d{3}\s?[-.]?\s?\d{4}\b/g;
const INTL_PHONE_PATTERN =
  /\+\d{1,3}\s?[-.]?\s?(?:\(?\d{1,4}\)?[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}(?:[\s.-]?\d{1,4})?\b/g;
const PHONE_PLACEHOLDER = '[PHONE_NUMBER]';

console.log('[Prompt Wrangler] Injected script (main world) loaded');

const originalFetch = window.fetch;

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function detectEmails(text: string): DetectedIssue[] {
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

function detectPhones(text: string): DetectedIssue[] {
  const issues: DetectedIssue[] = [];
  const seen = new Set<string>();

  // Check international first (more specific)
  for (const match of text.matchAll(INTL_PHONE_PATTERN)) {
    if (match[0] && !seen.has(match[0])) {
      seen.add(match[0]);
      issues.push({
        id: generateId(),
        type: 'phone',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  // Check US numbers
  for (const match of text.matchAll(US_PHONE_PATTERN)) {
    if (match[0] && !seen.has(match[0])) {
      seen.add(match[0]);
      issues.push({
        id: generateId(),
        type: 'phone',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function anonymizeEmails(text: string): string {
  return text.replace(EMAIL_PATTERN, EMAIL_PLACEHOLDER);
}

function anonymizePhones(text: string): string {
  let result = text;
  result = result.replace(INTL_PHONE_PATTERN, PHONE_PLACEHOLDER);
  result = result.replace(US_PHONE_PATTERN, PHONE_PLACEHOLDER);
  return result;
}

function scanAndAnonymize(obj: unknown): { anonymized: unknown; issues: DetectedIssue[] } {
  const allIssues: DetectedIssue[] = [];

  function processValue(value: unknown): unknown {
    if (typeof value === 'string') {
      const emailIssues = detectEmails(value);
      const phoneIssues = detectPhones(value);
      const hasIssues = emailIssues.length > 0 || phoneIssues.length > 0;

      if (hasIssues) {
        allIssues.push(...emailIssues, ...phoneIssues);
        let anonymized = anonymizeEmails(value);
        anonymized = anonymizePhones(anonymized);
        return anonymized;
      }
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => processValue(item));
    }

    if (value !== null && typeof value === 'object') {
      const newObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        newObj[key] = processValue(val);
      }
      return newObj;
    }

    return value;
  }

  const anonymized = processValue(obj);
  return { anonymized, issues: allIssues };
}

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  console.log('[Prompt Wrangler] Fetch intercepted:', url);

  if (
    url.includes('/backend-api/') &&
    init?.method === 'POST' &&
    init.body &&
    typeof init.body === 'string'
  ) {
    console.log('[Prompt Wrangler] ChatGPT API request detected, scanning...');

    try {
      const payload = JSON.parse(init.body) as unknown;
      const { anonymized, issues } = scanAndAnonymize(payload);

      if (issues.length > 0) {
        console.log('[Prompt Wrangler] Detected issues:', issues);

        // Send to content script via custom event
        window.dispatchEvent(
          new CustomEvent('prompt-wrangler-issues', {
            detail: { issues },
          })
        );

        // Modify request with anonymized payload
        const modifiedInit = {
          ...init,
          body: JSON.stringify(anonymized),
        };

        return await originalFetch(input, modifiedInit);
      }
    } catch (error) {
      console.error('[Prompt Wrangler] Error scanning request:', error);
    }
  }

  return await originalFetch(input, init);
};

console.log('[Prompt Wrangler] Fetch override installed');
