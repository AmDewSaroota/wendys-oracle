import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");
  const sp = await searchParams;
  const denied = sp.error === "AccessDenied";

  return (
    <main className="signin">
      <div className="card">
        <div className="logo">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.6" />
            <rect x="14" y="3" width="7" height="7" rx="1.6" />
            <rect x="3" y="14" width="7" height="7" rx="1.6" />
            <path d="M17.5 14v7M14 17.5h7" />
          </svg>
        </div>
        <h1>แคตตาล็อกช่องไอคอน Fortal</h1>
        <p>หน้านี้เปิดให้เฉพาะคนที่อยู่ในรายชื่อของทีม เข้าด้วยบัญชี Google ของคุณ</p>
        {denied ? (
          <div className="deny">
            บัญชี Google นี้ยังไม่อยู่ในรายชื่อที่เข้าได้ — บอกดิวให้เพิ่มอีเมลของคุณก่อน
          </div>
        ) : null}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: sp.next || "/" });
          }}
        >
          <button type="submit" className="gbtn">
            <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l-.1.3 6.5 5 .5.1c4.1-3.8 6.6-9.4 6.6-15.7z" />
              <path fill="#34A853" d="M24 46c5.9 0 10.9-1.9 14.5-5.3l-6.9-5.3c-1.8 1.3-4.3 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9l-.3.1-6.7 5.2-.1.3C8 41.1 15.4 46 24 46z" />
              <path fill="#FBBC05" d="M11.5 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.7-4.6v-.3l-6.8-5.3-.2.1A22 22 0 0 0 2 24c0 3.5.9 6.9 2.4 9.9l7.1-5.3z" />
              <path fill="#EB4335" d="M24 10.7c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.5 29.9 2 24 2 15.4 2 8 6.9 4.4 14.1l7.1 5.3c1.8-5.2 6.7-8.7 12.5-8.7z" />
            </svg>
            เข้าใช้งานด้วย Google
          </button>
        </form>
      </div>
    </main>
  );
}
