// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Target: 14 Juni 2026 00:00:00 WIB (Jakarta/Indonesia, UTC+7)
  // Dalam UTC: 13 Juni 2026 17:00:00 UTC
  const targetTimeStr = process.env.NEXT_PUBLIC_MOCK_TARGET_TIME || "2026-06-13T17:00:00Z";
  const targetTime = new Date(targetTimeStr).getTime();
  const now = Date.now();
  const { pathname } = request.nextUrl;

  const isBypass = request.cookies.get("bypass_teaser")?.value === "true";

  // Jika belum waktunya dan user mencoba akses halaman utama, lempar ke teaser
  if (now < targetTime && pathname === "/" && !isBypass) {
    return NextResponse.redirect(new URL("/teaser", request.url));
  }

  // Jika sudah waktunya dan user masih di teaser, arahkan ke halaman utama
  if (now >= targetTime && pathname === "/teaser" && !isBypass) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/teaser"], // Terapkan middleware hanya pada rute ini
};
