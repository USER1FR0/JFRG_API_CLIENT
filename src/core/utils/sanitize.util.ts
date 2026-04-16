export function sanitize(value: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip HTML tags manually
    return value.replace(/<[^>]*>/g, '').trim();
  }
  // Client-side: use DOMPurify
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require('dompurify');
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

// Detecta caracteres peligrosos para inyección
export function containsDangerousChars(value: string): boolean {
  const dangerous = /[<>"'`;\\]|(--)|(\/\*)|(\*\/)/;
  return dangerous.test(value);
}

export function isBlankString(value: string): boolean {
  return value.trim().length === 0;
}
