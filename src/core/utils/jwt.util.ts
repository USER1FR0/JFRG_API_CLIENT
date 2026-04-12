export interface JwtPayload {
  id: number;
  name: string;
  lastName: string;
  hashToken?: string;
  exp: number;
  iat: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getTokenExpiresIn(token: string): number {
  const payload = decodeJwt(token);
  if (!payload) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
}
