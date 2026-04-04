// Admin user emails — add yours here
const ADMIN_EMAILS = new Set([
  'chug2k@gmail.com',
]);

// Also check env var for flexibility
const envAdmins = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
envAdmins.forEach(e => ADMIN_EMAILS.add(e));

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email);
}
