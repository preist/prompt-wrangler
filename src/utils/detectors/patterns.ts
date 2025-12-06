// Shared regex patterns for PII detection
// These are exported as constants so they can be used in both TypeScript modules
// and the injected script (which needs standalone patterns)

export const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
export const US_PHONE_PATTERN =
  /(?:\+?1\s?[-.]?\s?)?\(?[2-9]\d{2}\)?\s?[-.]?\s?\d{3}\s?[-.]?\s?\d{4}\b/g;
export const INTL_PHONE_PATTERN =
  /\+\d{1,3}\s?[-.]?\s?(?:\(?\d{1,4}\)?[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}(?:[\s.-]?\d{1,4})?\b/g;

export const EMAIL_PLACEHOLDER = '[EMAIL_ADDRESS]';
export const PHONE_PLACEHOLDER = '[PHONE_NUMBER]';

// Pattern order matters: more specific patterns first
export const PHONE_PATTERNS = [INTL_PHONE_PATTERN, US_PHONE_PATTERN] as const;
