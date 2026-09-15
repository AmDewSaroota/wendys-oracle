import Script from "next/script";

export const dynamic = "force-dynamic";

// เปลี่ยนทุกครั้งที่ build — กันเบราว์เซอร์ใช้ไฟล์เก่าค้างหลังดีพลอย
const V = String(Date.now());

export default function ScreensPage() {
  return (
    <>
      <div id="root" />
      <Script id="ver-screens" strategy="beforeInteractive">{`window.__V=${JSON.stringify(V)}`}</Script>
      <Script src={`/screens.js?v=${V}`} strategy="afterInteractive" />
    </>
  );
}
