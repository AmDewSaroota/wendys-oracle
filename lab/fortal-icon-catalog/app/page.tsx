import Script from "next/script";

export const dynamic = "force-dynamic";

// เปลี่ยนทุกครั้งที่ build — กันเบราว์เซอร์ใช้ไฟล์เก่าค้างหลังดีพลอย
const V = String(Date.now());

export default function Page() {
  return (
    <>
      <div id="root" />
      <div className="toast" id="toast" />
      <Script id="ver" strategy="beforeInteractive">{`window.__V=${JSON.stringify(V)}`}</Script>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" strategy="afterInteractive" />
      <Script src={`/app.js?v=${V}`} strategy="afterInteractive" />
    </>
  );
}
