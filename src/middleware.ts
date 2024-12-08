import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Export clerk middleware
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // Check for valid entry token
    const entryToken = request.cookies.get("entry_token");
    if (!entryToken || entryToken.value !== process.env.ENTRY_TOKEN) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
});

// Define your public routes
const isPublicRoute = (request: Request) => {
  const url = new URL(request.url);
  return (
    url.pathname === "/" ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/api/validate-entry")
  );
};

// Export config with matcher
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
