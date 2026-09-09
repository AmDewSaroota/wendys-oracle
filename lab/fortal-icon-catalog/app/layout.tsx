import type { Metadata } from "next";

const V = String(Date.now());

export const metadata: Metadata = {
  title: "แคตตาล็อกช่องไอคอน Fortal",
  description: "ทุกช่องไอคอนที่ต้องวาดใหม่ จับกลุ่มตามไอคอนที่ใช้ซ้ำ พร้อมตำแหน่งจริงในเว็บ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href={`/app.css?v=${V}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
