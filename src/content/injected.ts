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

function anonymizeEmails(text: string): string {
  return text.replace(EMAIL_PATTERN, EMAIL_PLACEHOLDER);
}

function scanAndAnonymize(obj: unknown): { anonymized: unknown; issues: DetectedIssue[] } {
  const allIssues: DetectedIssue[] = [];

  function processValue(value: unknown): unknown {
    if (typeof value === 'string') {
      const issues = detectEmails(value);
      if (issues.length > 0) {
        allIssues.push(...issues);
        return anonymizeEmails(value);
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
