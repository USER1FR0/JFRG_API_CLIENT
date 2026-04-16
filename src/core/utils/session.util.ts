export function setSessionCookie() {
  document.cookie = 'session=1; path=/; SameSite=Strict';
}

export function clearSessionCookie() {
  document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}