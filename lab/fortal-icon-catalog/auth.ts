import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const list = (v?: string) =>
  (v || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export const ALLOWED_EMAILS = list(process.env.ALLOWED_EMAILS);
export const ALLOWED_DOMAINS = list(process.env.ALLOWED_DOMAINS);
export const REVIEWER_EMAILS = list(process.env.REVIEWER_EMAILS);

/**
 * อีเมลนี้เข้าใช้งานได้ไหม
 * ปิดไว้ก่อนเสมอ — ยังไม่ตั้ง ALLOWED_EMAILS/ALLOWED_DOMAINS = ไม่มีใครเข้าได้
 * (กันกรณีเผลอดีพลอยขึ้นไปโดยยังไม่ได้ใส่รายชื่อ)
 */
export function isAllowed(email?: string | null) {
  const e = (email || "").toLowerCase();
  if (!e) return false;
  if (!ALLOWED_EMAILS.length && !ALLOWED_DOMAINS.length) return false;
  if (ALLOWED_EMAILS.includes(e)) return true;
  return ALLOWED_DOMAINS.some((d) => e.endsWith("@" + d));
}

/** กดผ่าน/ตีกลับได้ไหม — ไม่ตั้ง REVIEWER_EMAILS = ทุกคนที่เข้าได้ก็รีวิวได้ */
export function isReviewer(email?: string | null) {
  const e = (email || "").toLowerCase();
  if (!e) return false;
  if (!REVIEWER_EMAILS.length) return true;
  return REVIEWER_EMAILS.includes(e);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: { signIn: "/signin", error: "/signin" },
  callbacks: {
    signIn({ profile }) {
      return isAllowed(profile?.email as string | undefined);
    },
    session({ session }) {
      return session;
    },
  },
});
