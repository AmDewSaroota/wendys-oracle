import { auth } from "@/auth";

export default auth((req) => {
  const p = req.nextUrl.pathname;
  const open = p.startsWith("/signin") || p.startsWith("/api/auth");
  if (!req.auth && !open) {
    const url = new URL("/signin", req.nextUrl.origin);
    if (p !== "/") url.searchParams.set("next", p);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|app.css).*)"],
};
